const mongoose = require('mongoose')
const Schema = mongoose.Schema

let UserSchema = new Schema({
    first_name: {
        type: String,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        required: [true, "First name is required"],

    },
    last_name: {
        type: String,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Email address is required"],
        match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, 'is invalid'],
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {
    collection: 'User'
})

var User = mongoose.model('User', UserSchema)
module.exports = User
