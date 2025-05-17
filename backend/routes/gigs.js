const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Gig = require('../models/Gig');
router.post('/',authenticate,async(req,res)=>{
    try{
        const gig = await Gig.create({
            title: req.body.title,
            description:req.body.description,
            budget: req.body.budget,
            client: req.userid
        });
        res.status(201).json(gig);
    } catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/',async(req,res)=>{
    try{
        const gigs = await
        Gig.find().populate('client','name email');
        res.json(gigs);
    }
    catch(err){
        res.status(500).json({
            error: 'Failed to fetch gigs'
        });
    }
});
module.exports = router;