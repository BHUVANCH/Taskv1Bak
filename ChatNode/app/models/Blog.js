// Importing Mongoose Module
const mongoose = require('mongoose');
// Importing Schema
let Schema = mongoose.Schema;
let blogSchema = new Schema(
    {
        blogId: {
            type: String,
            unique: true
        },
        title: {
            type:String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        bodyHtml: {
            type: String,
            defaut: ''
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        category: {
            type: String,
            default: ''
        },
        author: {
            type: String,
            default: ''
        },
        tags: [],
        created: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        }
    }
);

mongoose.model('Blog', blogSchema);

