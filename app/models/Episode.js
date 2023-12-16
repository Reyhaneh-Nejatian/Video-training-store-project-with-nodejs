const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')


const Episode = mongoose.Schema({
    course : { type : Schema.Types.ObjectId, ref : 'Course'},
    number : { type : String, require : true},
    title : { type : String, require : true},
    body : { type : String, require : true},
    type : { type : String, require : true},
    time : { type : String, default : '00:00:00'},
    videoUrl : { type : String, require : true},
    viewCount : { type : Number, default : 0},
    downloadCount : { type : Number, default : 0},
    commentCount : { type : Number, default : 0}
},{
    timestamps : true,
})


Episode.plugin(mongoosePaginate)

module.exports =  mongoose.model('Episode', Episode)