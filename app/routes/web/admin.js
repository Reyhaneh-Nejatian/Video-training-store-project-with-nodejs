const express = require('express')
const router = express.Router();
const upload = require('app/uploadImages')

router.use((req, res, next)=>{
    res.locals.layout = "admin/master"
    next();
})

//controllers
const adminController = require('app/http/controllers/adminController')
const courseController = require('app/http/controllers/course/courseController')
const episodeController = require('app/http/controllers/episode/episodeController')

//validator
const courseValidator = require('app/http/validators/courseValidator')
const episodeValidator = require('app/http/validators/episodeValidator')

//middleware
const fileToField = require('app/http/middleware/fileToFiels')


router.get('/', adminController.index)

//course
router.get('/course', courseController.index);
router.get('/course/create', courseController.create);
router.post('/course/create', upload.single('images'), fileToField.handle, courseValidator.handle(), courseController.store);
router.delete('/course/:id', courseController.destroy);
router.get('/course/:id/edit', courseController.edit);
router.put('/course/:id', upload.single('images'), fileToField.handle, courseValidator.handle(), courseController.update)


//episode
router.get('/episode', episodeController.index);
router.get('/episode/create', episodeController.create);
router.post('/episode/create', episodeValidator.handle(), episodeController.store);
router.delete('/episode/:id', episodeController.destroy);
router.get('/episode/:id/edit', episodeController.edit);
router.put('/episode/:id', episodeValidator.handle(), episodeController.update)

module.exports = router;