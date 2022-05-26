const express = require('express');
const axios = require('axios');
const { renderString } = require('nunjucks');
const router = express.Router();
require('dotenv').config();

const requestInterval = 8000;

router.get('/practice', async (req, res) => {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    }
    
    res.writeHead(200, headers);
    
    setInterval(() => {
        res.write("data: " + `${new Date().toLocaleTimeString()}` + "\n\n");
    }, requestInterval);

    res.on('close', () => {
        console.log('request over');
        res.end();
    })

})

router.get('/practice-sse', (req, res) => {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    }

    res.writeHead(200, headers);
    
    setInterval(async () => {
        const url = "http://httpstat.us/200";
        const status_result = await status_info(url);
        res.write("data: " + status_result + "\n\n");
    }, requestInterval);

    res.on('close', () => {
        console.log('request over');
        res.end();
    })

})

router.get('/random', (req, res) => {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    }

    res.writeHead(200, headers);
    
    const sec = Math.floor(Date.now() / 10000);    
    console.log(sec);
    if(sec % 3 == 0) {
        const j = {"opeartional" : true, "msg": "ok"};
        res.write("data: " + JSON.stringify(j) + "\n\n");
    }
    else if(sec % 3 == 1) {
        const j = {"opeartional" : false, "msg": "server error"};
        res.write("data: " + JSON.stringify(j) + "\n\n");
    }
    else {
        const j = {"opeartional" : false, "msg": "development"};
        res.write("data: " + JSON.stringify(j) + "\n\n");
    }
    
    setInterval(async () => {        
        const sec = Math.floor(Date.now() / 10000);    
        console.log(sec);
        if(sec % 3 == 0) {
            const j = {"opeartional" : true, "msg": "ok"};
            res.write("data: " + JSON.stringify(j) + "\n\n");
        }
        else if(sec % 3 == 1) {
            const j = {"opeartional" : false, "msg": "server error"};
            res.write("data: " + JSON.stringify(j) + "\n\n");
        }
        else {
            const j = {"opeartional" : false, "msg": "development"};
            res.write("data: " + JSON.stringify(j) + "\n\n");
        }
    }, requestInterval);

    res.on('close', () => {
        console.log('request over');
        res.end();
    })
})


// Gets the error code and status of url
const status_info = async (url) => {
    try {
        const result = await axios.get(url);
        const success_res = {'operational' : 'operational', 'msg' : "OK"}
        console.log(JSON.stringify(success_res));
        return JSON.stringify(success_res);
    } catch (error) {
        const error_res = {'error_code' : error.code, 'msg' : error.response.status}
        await sendMessage(`Service Error at ${Date.now()}`)
        console.log(JSON.stringify(error_res));
        return JSON.stringify(error_res);
    }
}



// Sends message to slack
const sendMessage = async (text) => {
    try {
        console.log(process.env.SLACK_URL);
        const result = await axios.post(process.env.SLACK_URL, {"text": "hello"});
        console.log("message sent");        
    } catch(err) {
        // console.error(err)
    }
}



module.exports = router;