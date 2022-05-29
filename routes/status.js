const express = require('express');
const { Status } = require('../models');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const requestInterval = 1000 * 10;


router.get('/info', (req, res) => {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    }

    res.writeHead(200, headers);
    setInterval(async () => {
        

        let val = {};

        const result_newara = await Status.findOne({where : {service: "newara"}});
        const result_otl = await Status.findOne({where : {service: "otl"}});
        const result_sso =  await Status.findOne({where : {service: "sso"}});
        const result_geoul = await Status.findOne({where : {service: "geoul"}});
        const result_home = await Status.findOne({where : {service: "home"}});
        const result_zabo = await Status.findOne({where : {service: "zabo"}});
        const result_kono = await Status.findOne({where : {service: "kono"}});
        const result_random = await Status.findOne({where : {service: "random"}});

        val['newara'] = result_newara["operational"];
        val['otl'] = result_otl["operational"];
        val['sso'] = result_sso["operational"];
        val['geoul'] = result_geoul["operational"];
        val['home'] = result_home["operational"];
        val['zabo'] = result_zabo["operational"];
        val['kono'] = result_kono["operational"];
        val['random'] = result_random["operational"];

        for(let [key, value] of Object.entries(val)) {
            val[key] = value === true ? "operational" : "inoperational";
        }

        res.write("data: " + JSON.stringify(val) + "\n\n");

    }, requestInterval);

    res.on('close', () => {
        console.log('request over');
        res.end();
    })

})



module.exports = router;