// Importing Mongoose Module
let mongoose = require('mongoose');
// Creating Onstance of Mongoose.Schema
let userSchema = new mongoose.Schema({

    userId: {
        type: String,
        default: '',
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: 'password'
    },
    email: {
        type: String,
        default: '',
        unique: true
    },
    mobileNumber: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('User', userSchema);