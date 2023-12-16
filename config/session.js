const mongoose = require('mongoose');
const session  = require('express-session');
const connectMongo = require('connect-mongo');

module.exports = {
        secret : 'secretID',
        resave : true,
        saveUninitialized : true,
        store : connectMongo.create({mongoUrl : 'mongodb://localhost/store'}),
}