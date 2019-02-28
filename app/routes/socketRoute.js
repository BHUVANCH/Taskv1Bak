const express = require('express');

let setRouter = (app) => {
    app.get('/hello-World',helloWorld);
    app.get('/next',next);
    app.get('/example', example);
}


helloWorld = (req, res) => {
    res.send('Passed app to the method');
}

next = (req, res) => {
    res.send(`that method will tigger 
    to callback function to respond according to the endpoint`);
}

example =(req, res) => {
    res.send('This is the example Function');
}

// the Function is exported
module.exports = {
    setRouter : setRouter
}