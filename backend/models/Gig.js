const { default: mongoose } = require("mongoose");

const gigSchema = new mongoose.Schema({
    title: {type:String, required: true},
    description: {type: String, required: true},
    budget: {type: Number, required: true},
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    skillsRequired: {type: [String]},
    location: {type: String},
    status: {type: String, enum: ['open','assigned','completed'], default:'open'}
})