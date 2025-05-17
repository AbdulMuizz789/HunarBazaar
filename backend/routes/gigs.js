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
            client: req.userId
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
        const gigs = await Gig.find().populate('client','name email');
        res.json(gigs);
    }
    catch(err){
        res.status(500).json({
            error: 'Failed to fetch gigs'
        });
    }
});

router.get('/applied',authenticate,async (req,res) => {
    try {
        const gigs = await Gig.find({
            'applications.artisan':req.userId
        }).populate('client','name').lean();

        const result = gigs.map(gig => {
            const app = gig.applications.find(a => a.artisan.toString() === req.userId);
            return {
                _id:gig._id,
                title:gig.title,
                description:gig.description,
                budget:gig.budget,
                client:gig.client,
                booking: gig.booking,
                application: {
                    _id: app?._id,
                    status: app?.status || 'pending'
                }
            };
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
})

module.exports = router;