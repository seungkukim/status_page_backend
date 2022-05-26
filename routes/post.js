const express = require('express');
const { Post } = require('../models');
const router = express.Router();
const { Op } = require('sequelize');


router.get('/:id', async (req, res) => {
    try {
        const result = await Post.findOne({
            where: {id : req.params.id }
        })

        res.json(result);

    } catch(err) {
        console.error(err);
    }

})

router.get('/', async (req, res) => {
    try {
        const service = req.body.service;

        const result = await Post.findAll();

        res.json(result);

    } catch(err) {
        console.error(err);
    }

})

// router.get('/', async (req, res) => {
//     try {
//         const service = req.body.service;

//         const result = await Post.findAll({
//             where: {
//                 service : {
//                     [Op.in] : service
//                 }
//             },
//             order : [['updatedAt', 'DESC']]
//         })

//         res.json(result);

//     } catch(err) {
//         console.error(err);
//     }

// })

router.put('/', async (req, res) => {
    try {
        const content = req.body.content;
        const service = req.body.service;
        console.log(content);

        const result = await Post.create({
            content: content,
            service: service
        });

        res.json(result);

    } catch(err) {
        console.error(err);
    }

})

router.post('/:id', async (req, res) => {
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

    } catch(err) {
        console.log(err);
    }
})

router.delete('/:id', async (req, res) => {
    try {

        const result = await Post.destroy({
            where: {id: req.params.id}
        });

        res.json(result);

    } catch(err) {
        console.log(err);
    }
})


// router.get('/test', (req, res) => {
//     // const service = JSON.parse(req.body.service);
//     const service = req.body.service;
//     console.log(service);
//     res.json(service);
// })

module.exports = router;