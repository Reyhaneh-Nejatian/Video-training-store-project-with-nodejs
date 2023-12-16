const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
// const uniqueString = require('unique-string') // برای ایجاد یک توکن
const { v4: uuidv4 } = require('uuid');  // برای ایجاد یک توکن
const mongoosePaginate = require('mongoose-paginate-v2')



const Course = mongoose.Schema({
    user : { type : Schema.Types.ObjectId, ref : 'User'},
    title : { type : String, require : true},
    slug : { type : String, default : ''},
    body : { type : String, require : true},
    type : { type : String, require : true},
    images : { type : Object, require : true},
    price : { type : String, require : true},
    time : { type : String, default : '00:00:00' },
    tags : { type : String, require : true},
    viewCount : { type : Number, default : 0},
    commentCount : { type : Number, default : 0}
},{
    timestamps : true,
    toJSON : {virtuals : true}
})


Course.plugin(mongoosePaginate)

Course.virtual('episodes', {
    ref : 'Episode',
    localField : '_id',
    foreignField : 'course'
})

module.exports =  mongoose.model('Course', Course)