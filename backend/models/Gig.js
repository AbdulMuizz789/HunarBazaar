const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
    title: {type:String, required: true},
    description: {type: String, required: true},
    budget: {type: Number, required: true},
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true});

module.exports = mongoose.model('Gig', gigSchema);