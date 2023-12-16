const controller = require('./../controller')
const Course = require('app/models/Course')
const Episode = require('app/models/Episode')


class episodeController extends controller{

    async index(req, res, next){
        let page = req.query.page || 1;
        const episodes = await Episode.paginate({}, {page, limit : 10, sort : { createAt : 1 }, populate : 'course'});
        res.render('admin/episode/index', {episodes})
    }

    async create(req, res, next){
        const courses = await Course.find({})
        res.render('admin/episode/create', { messages: req.flash('errors'), courses})
    }

    async store(req, res, next){
        let result = await this.validationForm(req);
        if(result){
            this.storeProcess(req, res, next)
        }else{
            return this.back(req, res)
        }
    }

    storeProcess(req, res, next){
        const addEpisode = new Episode({...req.body})
        this.updateCourseTime(req.body.course);

        addEpisode.save()
        .then(() => {
            console.log('Episode saved successfully');
            res.redirect('/admin/episode');
        })
        .catch(err => {
            console.error(err);
            res.redirect('/admin/episode/create'); // یا هر کار دیگری که نیاز دارید
        });

    }

    async edit(req, res, next){
        const episode = await Episode.findById(req.params.id);
        const courses = await Course.find({})
        res.render('admin/episode/edit', {messages: req.flash('errors'), episode, courses});
    }

    async update(req, res, next){
        let result = await this.validationForm(req);
        if(result){
            this.updateProcess(req, res, next)
        }else{
            this.back(req, res)
        }
    }

    async updateProcess(req, res, next){

        const episode = await Episode.findByIdAndUpdate(req.params.id, {$set : {...req.body}});

        // update course time
        this.updateCourseTime(episode.course);
        
        res.redirect('/admin/episode')
    }

    async destroy(req, res, next){
        let episode = await Episode.findById(req.params.id);
        if(! episode){
            res.json('چنین دوره ای در سایت ثبت نشده است')
        }
        this.updateCourseTime(episode.course);
        await episode.deleteOne();  //حذف دوره
        return res.redirect('/admin/episode');
            
    }

    async updateCourseTime(courseId){
        const course = await Course.findById(courseId).populate('episodes').exec();
        course.set({ time: this.getTime(course.episodes) })
        await course.save();
    }

}

module.exports = new episodeController();