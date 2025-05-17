const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum:['artisan','client']},
    skills: {type: [String], default: []},
    location: {type: String},
    portfolio: {type: String}
})

module.exports = mongoose.model('User', userSchema);