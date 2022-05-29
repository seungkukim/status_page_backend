const express = require('express');
const session = require('express-session');
const { Client } = require('ldapts');
const router = express.Router();
require('dotenv').config();


router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const OLADAPOptions = {
        url: process.env.LDAP_BASE_URL,
        timeout: 0,
        strictDN: true
    }

    const client = new Client(OLADAPOptions);

    let login_success = false;
    try {
        await client.bind(`uid=${ username },ou=People,dc=sparcs,dc=org`, password);       
        await client.unbind();
        login_success = true;

        req.session.username = username;
        req.session.isLoggedIn = true;
        req.session.save();
        res.send();

    } catch(err) {
        login_success = false;
        res.status(400).send("Invalid login");

    }
})


router.post('/logout', async (req, res) => {
    req.session.destroy();
    res.json("Logged out");
})


module.exports = router;