const express = require('express');
// const session = require('express-session');
const router = express.Router();


const myname = "abc";
const mypassword = "123";

router.get('/login', async (req, res) => {
    if(req.body.username == myname && req.body.password == mypassword) {
        // session = req.session;
        // session.userid = req.body.username;
        // res.json("logged in");
        req.session.userId = req.body.username;
        req.session.isLogined = true;
        req.session.save();
        console.log(req.session);
        console.log(req.session.isLogined);
        res.send();
    }
})

// router.get('')



router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.json("logged out");
})


module.exports = router;