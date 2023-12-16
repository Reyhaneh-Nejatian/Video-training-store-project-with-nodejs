const express = require('express')
const router = express.Router();

const homeRoutes = require('./home')
const authRoutes = require('./auth')
const adminRoutes = require('./admin')


//middleware
const redirectAuthenticated = require('app/http/middleware/redirectAuthenticated')
const redirectAdmin = require('app/http/middleware/redirectAdmin')



//Home
router.use('/', homeRoutes)


//Auth
router.use('/auth', redirectAuthenticated.handle, authRoutes)

//Admin
router.use('/admin', redirectAdmin.handle, adminRoutes)

module.exports = router