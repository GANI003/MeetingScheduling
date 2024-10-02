import express from "express";
import dotenv from "dotenv";
// import axios from axios;
dotenv.config({});
import { google } from 'googleapis';
import dayjs from 'dayjs';
import {v4 as uuid} from 'uuid';
const calendar = google.calendar({
    version : "v3",
    auth : process.env.API_KEY,
})
const app = express();
const PORT = process.env.NODE_ENV || 3000;
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)
const scopes = [
    "https://www.googleapis.com/auth/calendar"
];
const token = ""
app.get("/google",function(req,res){
    const url = oauth2Client.generateAuthUrl({
        access_type : "offline",
        scope : scopes,
    });
    res.redirect(url);
});
app.get("/google/redirect",async (req,res) => {
    // console.log("Coming ");
    try {
        const code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send("You Successfully Logged IN!");
    } catch (error) {
        console.error("Error retrieving access token", error);
        res.status(500).send("Error retrieving access token");
    }
    
})
app.get('/schedulerEvent',async (req,res) => {
    await calendar.events.insert({
    calendarId : "primary",
    auth : oauth2Client,
    conferenceDataVersion : 1,
    requestBody : {
        summary : "This is Test Event",
        description : "Some event very Important",
        start : {
            dateTime : dayjs(new Date()).add(1,'day').toISOString(),
            timeZone : "Asia/Kolkata",
        },
        end : {
            dateTime : dayjs(new Date()).add(1,'day').add(1,"hour").toISOString(),
            timeZone : "Asia/Kolkata",
        },
        conferenceData : {
             createRequest : {
                requestId : uuid(),
             }
        },
        attendees : [{
            email : "user@gmail.com",
        }]
    },
   });
   res.send(
    {
        msg : "Done"
    }
   );
})
app.listen(PORT,() => {
    console.log("Server started on port: ",PORT);
});
