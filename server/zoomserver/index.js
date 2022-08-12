// Bring in environment secrets through dotenv
require('dotenv/config')
// Use the request module to make HTTP requests from Node
const request = require('request')
const cors = require('cors')
// Run the express app
const express = require('express')
const app = express()

// TODO: read from config /
const CLIENT_ID = ''
const CLIENT_SEC = ''
const REDERECT_URL = 'https://REPLACE.ngrok.io/validate'
const accessTokens = new Map();


app.use(cors())
// app.use(cors({origin: '*'}));

// app.use(cors({
//   'allowedHeaders': ['sessionId', 'Content-Type'],
//   'exposedHeaders': ['sessionId'],
//   'origin': '*',
//   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   'preflightContinue': false
// }));

// Allow CORS access
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', '*');
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// Call Zoom auth API
app.get('/validate', async (req, res) => {

  // check user access token is avaialbel or expried

  if (!accessTokens.get(req.query.code)) {
    // Request an access token using the auth code
    let url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${REDERECT_URL}`

   await request.post(url, (error, response, body) => {
      if (error || !body) {
        console.error('error when generating the oauth token.')
        res.send(401).send({ status: 'error' })
      }
      body = JSON.parse(body);
      console.log(body)

      // Logs your access and refresh tokens in the browser
      // store in persistance layer
      console.log(`access_token: ${body.access_token}`);
      console.log(`refresh_token: ${body.refresh_token}`);
      const accessData =  { access_token: body.access_token, refresh_token: body.refresh_token }
      accessTokens.set(req.query.code,accessData)

      res.send(200)

    }).auth(CLIENT_ID, CLIENT_SEC);

  } else {
    // Do this step manually provided you have a single user.
    // since this needs to be done only once
    res.redirect(`https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDERECT_URL}`)

  }
})

app.get('/user', async (req, res) => {

  // obrain the access token for user from storage
  //const access_token = 'eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI1YjdiYjkwZi0wYWMzLTRhZDAtODEyZC0xZTBlYTcyZjQ0NzgifQ.eyJ2ZXIiOjcsImF1aWQiOiJiMjVhMWE5MzM1ZjFiMmQ0MzMxNjcwYTcxNWEzYmZmNSIsImNvZGUiOiJWZ1hpc2hRdnZLXzJuQThwRUF1UWlLajY1dzl3T2kwc1EiLCJpc3MiOiJ6bTpjaWQ6MzhsNjFwTGdUVUNaa0VRRzJ0Zzh4dyIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiIybkE4cEVBdVFpS2o2NXc5d09pMHNRIiwibmJmIjoxNjYwMjc5Nzk3LCJleHAiOjE2NjAyODMzOTcsImlhdCI6MTY2MDI3OTc5NywiYWlkIjoicEhreFRBWFNUWFc3bV9iUFozRTd5QSIsImp0aSI6IjYwYWQzZjBiLWM1ZmYtNDI0OS04NGNhLTg0NmRhODQ3Mzc2YiJ9.nfY9ehvZmBTTjCfvyPUkij7P82aocOK4cXyJ_ayPn5NIZY5VPY_fqdaWJgXFAuk5sq9ORho6eeCgSC04rQGBsg'

  const accessData = accessTokens.get(req.query.code);
  if (accessData != undefined && accessData.access_token) {
    request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
      if (error) {
        console.error(error)
        console.error('API Response Error: when getting user data.')
        res.send(500).send({ status: 'error' })
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
    }).auth(null, null, true, accessData.access_token);
  } else {
    res.send(401)
  }
});

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
      "Authorization": `Bearer ${body.access_token}`,
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

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.get('/callback', (req, res) => {
  res.send('user authorized')
})

app.listen(80, () => console.log(`Zoom app listening at PORT: 80`))
