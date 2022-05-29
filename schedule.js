const express = require('express');
const { Status } = require('./models');
const router = express.Router();
const { Sequelize } = require('sequelize');
const axios = require('axios');
require('dotenv').config();

let random_counter = 0;
let error_counter = {};
const service_name = ["newara", "otl", "sso", "geoul", "home", "zabo", "kono", "random"];
for(const service of service_name) {
    console.log(service);
    error_counter[service] = 0;
}


const check_status = (requestInterval) => {

    setInterval(async () => {

        const result_newara = await status_info("https://newara.sparcs.org/", "newara");
        const result_otl = await status_info("https://otl.kaist.ac.kr/", "otl");
        const result_sso =  await status_info("https://sparcssso.kaist.ac.kr/", "sso");
        const result_geoul = await status_info("http://ftp.sparcs.org/", "geoul");
        const result_home = await status_info("https://sparcs.org/", "home");
        const result_zabo = await status_info("https://zabo.sparcs.org/", "zabo");
        const result_kono = await status_info("http://httpstat.us/400", "kono");
        const result_random = random_info();

    }, requestInterval);

}

const initialize_status = async () => {
    await Status.create({operational: false, service: "newara"});
    await Status.create({operational: false, service: "otl"});
    await Status.create({operational: false, service: "sso"});
    await Status.create({operational: false, service: "geoul"});
    await Status.create({operational: false, service: "home"});
    await Status.create({operational: false, service: "zabo"});
    await Status.create({operational: false, service: "kono"});
    await Status.create({operational: false, service: "random"});
}

const status_info = async (url, service_name) => {
    try {
        const result = await axios.get(url);
        const update_status = await Status.update({
            operational: true,
        }, {
            where: {service: service_name}
        })

    } catch (error) {
        error_counter[service_name] = error_counter[service_name] + 1;
        const update_status = await Status.update({
            operational: false,
        }, {
            where: {service: service_name}
        })
    }
}

const random_info = async () => {

    if(random_counter % 2 === 0) {
        const update_status = await Status.update({
            operational: true,
        }, {
            where: {service: "random"}
        })
    }
    else {
        error_counter["random"] = error_counter["random"] + 1;
        const update_status = await Status.update({
            operational: false,
        }, {
            where: {service: "random"}
        })
    }
    random_counter++;
}


// Sends message to slack
const sendMessage = async (requestInterval) => {
    let text = "";

    setInterval(async () => {
        for(const service of service_name) {
            if(error_counter[service] > 0) {
                console.log(service);
                text = service + " had " + (error_counter[service] * 2) + " errors in the last 30 min\n" + text;
            }
        }
        console.log("text is: " + text);
        try {
            const result = await axios.post(process.env.SLACK_URL, {"text": `${ text }`});
        }
        catch(err) {
            console.error(err);
        }

        text = "";

        for(const service of service_name) {
            error_counter[service] = 0;
        }

    }, requestInterval);

}


module.exports = { initialize_status , check_status, sendMessage };