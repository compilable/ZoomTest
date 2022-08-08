// const zoomConfig = require("../config/zoom.js");
// const jwt = require("jsonwebtoken");
// const rp = require("request-promise");

// Bring in environment secrets through dotenv
require('dotenv/config')

// Use the request module to make HTTP requests from Node
const request = require('request')

const cors = require('cors')

// Run the express app
const express = require('express')
const app = express()

app.use(cors())

// Allow CORS access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Call Zoom auth API
app.get('/', (req, res) => {


    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");


    // Step 1:
    // Check if the code parameter is in the url
    // if an authorization code is available, the user has most likely been redirected from Zoom OAuth
    // if not, the user needs to be redirected to Zoom OAuth to authorize

    if (req.query.code) {

        // Step 3:
        // Request an access token using the auth code

        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URL;

        request.post(url, (error, response, body) => {

            // Parse response to JSON
            body = JSON.parse(body);

            // Logs your access and refresh tokens in the browser
            console.log(`access_token: ${body.access_token}`);
            console.log(`refresh_token: ${body.refresh_token}`);

            if (body.access_token) {

                // Step 4:
                // We can now use the access token to authenticate API calls

                // Send a request to get your user information using the /me context
                // The `/me` context restricts an API call to the user the token belongs to
                // This helps make calls to user-specific endpoints instead of storing the userID

                request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
                    if (error) {
                        console.log('API Response Error: ', error)
                    } else {
                        body = JSON.parse(body);
                        // Display response in console
                        console.log('API call ', body);
                        // Display response in browser
                        var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
                        res.send(`
                            <style>
                                @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                            </style>
                            <div class="container">
                                <div class="info">
                                    <img src="${body.pic_url}" alt="User photo" />
                                    <div>
                                        <span>Hello World!</span>
                                        <h2>${body.first_name} ${body.last_name}</h2>
                                        <p>${body.role_name}, ${body.company}</p>
                                    </div>
                                </div>
                                <div class="response">
                                    <h4>JSON Response:</h4>
                                    <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank">
                                        API Reference
                                    </a>
                                    ${JSONResponse}
                                </div>
                            </div>
                        `);
                    }
                }).auth(null, null, true, body.access_token);

            } else {
                // Handle errors, something's gone wrong!
            }

        }).auth(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_CLIENT_SECRET);

        return;

    }

    // Step 2:
    // If no authorization code is available, redirect to Zoom OAuth to authorize
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=vw5sSJryRey9d1QUqWrzYw&redirect_uri=https://b56f-203-222-134-3.au.ngrok.io')
  })



// old create meeting API
app.post("/meeting", (req, res) => {
  //email = "techconnectweb@gmail.com";
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/me/meetings",
    body: JSON.stringify({
      topic: req.body.topic,
      type: req.body.type,
      password: req.body.password,
      start_time: req.body.start_time,
      type: 2,                   // 1 = instant meeting, 2 = scheduled meeting
      default_password: false,
      duration: 40,              // 40 min is the max meeting time allowed with a basic free Zoom account
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    }),
    // auth: {
    //   bearer: token,
    // },
    headers: {
      "Authorization":`Bearer ${body.access_token}`,
      "Content-Yype": "application/json",
    },
    //json: true, //Parse the JSON string in the response
  };

  rp(options)
    .then(function (response) {

      // If successful, print join_url
      // TODO: add join_url to database, then redirect user to successful "MeetingCreated" page

      console.log("response is: ", response.join_url);
      // response.status(200).json(response);
      let dataRes = {
        join_url: response.join_url,
      };
      res.status(200).json(dataRes);
      res.send("Create meeting result: " + JSON.stringify(response));
    })
    .catch(function (err) {
      console.log("API call failed, reason ", err);
    });
});


app.listen(3008, () => console.log(`Zoom app listening at PORT: 3008`))
