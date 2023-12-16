const mongoose = require('mongoose')

const passwordReset = mongoose.Schema({
    email : {type : String, require : true},
    token : {type : String, require : true},
    use : {type : Boolean, default : false}
}, {
    timestamps : {updateAt : false}
})


module.exports = mongoose.model('passwordReset', passwordReset)
