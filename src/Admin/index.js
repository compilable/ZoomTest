import React, { useState } from "react";
import { ButtonContainer, Form, DashboardContainer, StyledButton } from "./AdminStyle";
import axios from "axios";

function Admin() {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        // TODO: check that all fields are not empty
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }

      const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(inputs);

        // get meeting data from form
        const meetingData = {
          topic: inputs.title,
          password: inputs.password,
          schedule_for: "ricamaeaverion22@gmail.com",     // TODO: get email of tutor (must be added to TechConnect Zoom account)
          start_time: inputs.dateTime,
        }

        // try {
        //   window.open(
        //   'https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.REACT_APP_CLIENT_ID + '&redirect_uri=' + REACT_APP_REDIRECT_URL,
        //   '_blank'
        // );
        // } catch (error) {
        //   console.log(error);
        // }


        // call auth API
        try {
          console.log("Calling auth API")
          await axios.get('https://7e64-14-203-92-224.au.ngrok.io', meetingData)
          .then((response) => {
              console.log("Hurray, this works");

              // If successfull, call create meeting API here or directly in back-end

          }, (error) => {
            console.log('Zoom API failed: ' + error.response.data);
            console.log(error);
          });
        } catch (error) {
          console.log(error);
        }


        // OLD - calling auth API

        // const authData = {

        // }

        // let url = "https://zoom.us/oauth/token?code=[CODE]&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauthredirect";

        // try {
        //   axios.post('https://zoom.us/oauth/token', authData, {
        //     headers: {
        //       'Authorization': 'Basic ' + window.btoa("vw5sSJryRey9d1QUqWrzYw:Ewy8zAOMWVPGOLL7wBb6fQ1GpRdiTZsv"),
        //       'Content-Type': 'application/x-www-form-urlencoded',
        //     }
        //   })
        //   .then((response) => {

        //     console.log("Oauth post successful. Code is: ")
        //   }, (error) => {
        //     console.log('Oauth called failed: ' + error.response.data);
        //   });
        // } catch (error) {
        //   console.log(error);
        // }


          // OLD - calling create meeting API

        // try {
        //   console.log("calling create meeting API")
        //   axios.post('http://localhost:3008/meeting', meetingData)
        //   .then((response) => {
        //     // let URL =
        //     // response.data.join_url.replaceAll(
        //     //   "https://us04web.zoom.us/j/",
        //     //   "http://localhost:3007/?"
        //     // ) + `?role=1?name=${username}`;
        //     // window.location.replace(`${URL}`);
        //     let URL = response.data.join_url;
        //     console.log(URL);
        //   }, (error) => {
        //     //console.log('Zoom API failed: ' + error);
        //     console.log('Zoom API failed: ' + error.response.data);
        //   });
        // } catch (error) {
        //   console.log(error);
        // }
      }

  return (
    <>
      <DashboardContainer>
        <h2>Hello admin v7</h2>
        <h3>Create a new meeting</h3>
        <Form onSubmit={handleSubmit} >
            <label>Student</label>
            {/* TODO: replace following code to fetch data from database*/}
            <select
                name="student"
                value={inputs.student || ""}
                onChange={handleChange}
                required
            >
                <option selected hidden>Choose...</option>
                <option value="student 1">Student 1</option>
                <option value="student 2">Student 2</option>
            </select>
            <label htmlFor='for'>Tutor</label>
            {/* TODO: replace following code to fetch data from database*/}
            <select
                name="tutor"
                value={inputs.tutor || ""}
                onChange={handleChange}
                required
            >
                <option selected hidden>Choose...</option>
                <option value="tutor 1">Tutor 1</option>
                <option value="tutor 2">Tutor 2</option>
            </select>
            <label>Meeting title</label>
            <input
                type='text'
                name="title"
                value={inputs.title || ""}
                onChange={handleChange}
                required
            />
            <label>Meeting password</label>
            <input
                type='text'
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
                required
            />
            <label>Date and time</label>
            <input
                type="datetime-local"
                name="dateTime"
                value={inputs.dateTime || ""}
                onChange={handleChange}
            />
            <ButtonContainer>
                <StyledButton type='submit'>CONFIRM</StyledButton>
            </ButtonContainer>
        </Form>
      </DashboardContainer>
    </>
  );
}

export default Admin;
