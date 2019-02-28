const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
// Importing Model
const BlogModel = mongoose.model('Blog');
const response = require('../libraries/standard');
const logger = require('../libraries/loogerLib');
let bC = {

    // helloWorld: (req, res) => {
    //     res.send('Passed app to the method');
    // },

    // next: (req, res) => {
    //     res.send(`that method will tigger 
    // to callback function to respond according to the endpoint`);
    // },

    // example: (req, res) => {
    //     res.send('This is the example Function');
    // },

    // testRoute: (req, res) => {
    //     console.log(req.params);
    //     res.send(req.params);
    // },

    // testQuery: (req, res) => {
    //     console.log(req.query);
    //     res.send(req.query);
    // },

    // testBody: (req, res) => {
    //     console.log(req.body);
    //     res.send(req.body);
    // }

    getAllBlogs: (req, res) => {
        BlogModel.find()
        .select('-_v -_id')
        .lean()
        .exec((err,  result) => {
                if (err) {
                   // console.log(err);
                    logger.captureError(err.message, 'BlogController: getAllBlogs', 10)
                    let apiResponse = response.format(true,'Failed to Find Blog Details', 500, null);
                    res.send(apiResponse);
                } else if (result == undefined || result == null || result == '') {
                   // console.log('No Blogs Found');
                    logger.captureInfo('No Blogs Found', 'BlogController: getAllBlogs', 10)
                    let apiResponse = response.format(true,'No Blogs Found', 404, null);
                    res.send(apiResponse);
                }else{
                   // console.log(result);
                    logger.captureInfo('Blogs Found', 'BlogController: getAllBlogs', 10)
                    let apiResponse = response.format(false,'Blogs Found', 200, result);
                    res.send(apiResponse);
                }
        });
    },// end of getAllBlogs

    viewBlogId : (req, res) => {
        console.log(req.user);
        BlogModel.findOne({'blogId': req.params.blogId}, (err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Find Blog Details', 500, null);
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Blogs Found');
                let apiResponse = response.format(true,'No Blogs Found', 404, null);
                res.send(apiResponse);
            }else{
                console.log(result);
                let apiResponse = response.format(false,'Blogs Found', 200, result);
                res.send(apiResponse);
            }
        });
    },// end of viewBlogId  

    viewByAuthor : (req, res) => {
        BlogModel.findOne({'author': req.params.author}, (err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Find Blog Details', 500, null);
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Blogs Found');
                let apiResponse = response.format(true,'No Blogs Found', 404, null);
                res.send(apiResponse);
            }else{
                console.log(result);
                let apiResponse = response.format(false,'Blogs Found', 200, result);
                res.send(apiResponse);
            }
        });
    },// end of viewByAuthor  

    viewByCategory : (req, res) => {
        BlogModel.findOne({'category': req.params.category}, (err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Find Blog Details', 500, null);
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Blogs Found');
                let apiResponse = response.format(true,'No Blogs Found', 404, null);
                res.send(apiResponse);
            }else{
                console.log(result);
                let apiResponse = response.format(false,'Blogs Found', 200, result);
                res.send(apiResponse);
            }
        });
    },// end of viewByCategory
    
    createBlog : (req, res) => {
        var today = Date.now()
        var blogId = shortid.generate()

        let newBlog = new BlogModel({
            blogId: blogId,
            title: req.body.title,
            description: req.body.description,
            isPublished: true,
            category: req.body.category,
            author: req.body.fullName,
            created: today,
            lastModified: today
        }) // end Of blog model

        let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags !='')?req.body.tags.split(',') : []
        newBlog.tags = tags;
        console.log(req.body.tags);

        newBlog.save((err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Create Blog', 500, null);
                res.send(apiResponse);
            } else {
                let apiResponse = response.format(false,'Blog Created Successfully', 200, result);
                res.send(apiResponse);
            }
        }); // end of blog save
    },

    editBlog : (req, res) => {
        let options = req.body;
        console.log(options);
        BlogModel.update({'blogId': req.params.blogId}, options, {multi: true}, (err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Find Blog Details', 500, null);
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Blogs Found');
                let apiResponse = response.format(true,'No Blogs Found', 404, null);
                res.send(apiResponse);
            }else{
                console.log(result);
                let apiResponse = response.format(false,'Blogs Found', 200, result);
                res.send(apiResponse);
            }
        });
    },// end of editBlog

    increaseBlogView : (req, res) => {
        BlogModel.findOne({'blogId': req.params.blogId}, (err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Increase Blog View', 500, null);
                res.send(apiResponse);
            } else if (result == undefined || result == '' || result == null) {
                console.log('No blog Found');
                let apiResponse = response.format(true,'No Blogs Found', 404, null);
                res.send(apiResponse);
            } else {
                result.views += 1;
                result.save((err, result) => {
                    if (err) {
                        console.log(err);
                        let apiResponse = response.format(true,'Failed to save Increase Blog View', 500, null);
                        res.send(apiResponse);
                    } else {
                        console.log('Blog Updated Sucessufully');
                        let apiResponse = response.format(false,'Blog Updated Sucessufully', 200, result);
                        res.send(apiResponse);
                    }
                }); // end of result
            }
        })
    },

    deleteBlog : (req, res) => {
        BlogModel.remove({'blogId': req.params.blogId}, (err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.format(true,'Failed to Find Blog Details', 500, null);
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Blogs Found');
                let apiResponse = response.format(true,'No Blogs Found', 404, null);
                res.send(apiResponse);
            }else{
                console.log(result);
                let apiResponse = response.format(false,'Blogs Found', 200, result);
                res.send(apiResponse);
            }
        });
    }

}

module.exports = {
    bC: bC
}