const express = require('express');
const { Post } = require('../models');
const router = express.Router();
const { Sequelize } = require('sequelize');


router.get('/service', async (req, res) => {
    try {
        const result = await Post.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('service')), 'service']
            ]
        });

        res.json(result);

    }
    catch(err) {
        res.status(400).send("error");
    }
})


router.get('/:id', async (req, res) => {
    try {
        const result = await Post.findOne({
            where: {id : req.params.id }
        })

        res.json(result);

    } 
    catch(err) {
        res.status(400).send("error");
    }

})


router.get('/', async (req, res) => {
    try {
        const result = await Post.findAll();

        res.json(result);

    } 
    catch(err) {
        res.status(400).send("error");
    }

})

router.put('/', async (req, res) => {
    // If user logined in as member
    if(req.session.isLoggedIn) {
        try {
            const content = req.body.content;
            const service = req.body.service;
            const title = req.body.title;

            console.log(content);

            const result = await Post.create({
                content: content,
                service: service,
                title: title
            });

            res.json(result);

        } 
        catch(err) {
            res.status(400).send("error");
        }
    }
    // Access denied for non-members
    else {
        res.status(400).send("error");
    }
})

router.post('/:id', async (req, res) => {
    // If user logined in as member
    if(req.session.isLoggedIn) {
        try {
            const modifiedContent = req.body.content;
            const modifiedService = req.body.service;

            const result = await Post.update({
                content: modifiedContent,
                service: modifiedService
            }, {
                where: {id: req.params.id}
            });

            res.json(result);

        } 
        catch(err) {
            res.status(400).send("error");
        }
    }
    // Access denied for non-members
    else {
        res.status(400).send("error");
    }
})

router.delete('/:id', async (req, res) => {
    // If user logined in as member
    if(req.session.isLoggedIn) {
        try {
            const result = await Post.destroy({
                where: {id: req.params.id}
            });

            res.json(result);

        } catch(err) {
            res.status(400).send("error");
        }
    }
    // Access denied for non-members
    else {
        res.status(400).send("error");
    }
})


module.exports = router;