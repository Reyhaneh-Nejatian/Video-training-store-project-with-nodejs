const express = require('express');
const router = express.Router();

//controllers
const homeControllers = require('./../../../app/http/controllers/homeControllers');



// Home routes
router.get('/' , homeControllers.index);

//logout
router.get('/logout' , (req,res)=>{
    req.logout((err)=>{
        if(err) return console.log(err)

        res.clearCookie('remember_token');
        res.redirect('/');
    });
})

module.exports = router;