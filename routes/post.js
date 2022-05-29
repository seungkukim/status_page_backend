const express = require('express');
const { Post } = require('../models');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');


router.get('/service', async (req, res) => {
    try {
        console.log('service testing');
        const result = await Post.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('service')), 'service']
            ]
    });

        res.json(result);

    }
    catch(err) {
        
    }
})

router.get('/:id', async (req, res) => {
    try {
        // console.log('hi')
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
        const title = req.body.title;

        console.log(content);

        const result = await Post.create({
            content: content,
            service: service,
            title: title
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


module.exports = router;