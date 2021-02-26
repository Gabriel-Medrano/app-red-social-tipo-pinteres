const path = require('path');
const fs = require('fs-extra');
const {v4: uuidv4} = require('uuid');
const {format} = require('timeago.js');

const publiControl = {};

const User = require('../models/user.model');
const Publication = require('../models/publication.model');
const Multimedia = require('../models/multimedia.model');
const Comment = require('../models/comment.model');
const Reaction = require('../models/reaction.model');
const {myComple} = require('../helpers/index.helper');

publiControl.formCreatePublication = (req,res) => {
    try {
        res.render('publication/form-create');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

publiControl.createPublication = async (req,res) => {
    try {
        const {title,sub_title,description} = req.body;
    
        const newPublication = new Publication({
            title: myComple.deleteSpace(title),
            sub_title: myComple.deleteSpace(sub_title),
            description: myComple.deleteSpace(description),
            user_id: req.user.id
        });

        if(!title) {
            await fs.unlink(req.file.path);
            req.flash('error_msg','The title es required');
            res.redirect('/publication/create');
        }else {
            const {encoding,originalname,mimetype,size} = req.file;
            const nameMulti = uuidv4();
            const ext = path.extname(originalname).toLowerCase();
            const multiPathTemp = req.file.path;
            const multiPathTarget = path.resolve(`./src/public/img/user/${req.user.nick_name}/${nameMulti}${ext}`);
        
            const newMultimedia = new Multimedia({
                filename: nameMulti + ext,
                encoding,
                originalname,
                mimetype,
                path: `/img/user/${req.user.nick_name}/${nameMulti}${ext}`,
                size,
                all_id: newPublication._id
            });
        
            await fs.rename(multiPathTemp,multiPathTarget);
            await newMultimedia.save();
            await newPublication.save();

            req.flash('success_msg','The publication created successfully');
            res.redirect('/');
        }   
    } catch (error) {
        if(req.file) {
            await fs.unlink(req.file.path);
        }
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
    
}

publiControl.viewPublication = async (req,res) => {
    try {
        const {id} = req.params;
        const publication = await Publication.findById(id).lean();
        const user = await User.findById(publication.user_id).lean();
        const multimedia = await Multimedia.findOne({all_id: publication._id}).lean();
        const comments = await Comment.find({all_id: publication._id}).lean().sort({createdAt: 'desc'}).limit(5);
        const reactions = await Reaction.find({all_id: publication._id}).lean();
    
        publication.user = user;
        publication.multimedia = multimedia;
        publication.comments = comments;
        publication.reactions = reactions.length;
    
        //SumComment
        let sumComment = 0;
        const countComments = await Comment.find({all_id: publication._id}).lean();
        for(const comment of countComments) {
            const comments = await Comment.find({all_id: comment._id}).lean();
            sumComment += comments.length;
        }
        publication.totalComments = countComments.length + sumComment;
        
        //for
        for(const comment of publication.comments) {
            const user = await User.findById(comment.user_id).lean();
            const reactions = await Reaction.find({all_id: comment._id}).lean();

            comment.user = user;
            comment.reactions = reactions.length;
            comment.dateAgo = format(comment.createdAt);

            //for
            for(const reaction of reactions) {
                if(reaction.user_id == req.user.id) {
                    comment.meReaction = reaction;
                }
            }

            //if
            if(comment.user_id == req.user.id) {
                comment.commentUser = true;
            }
        }
        for(const reaction of reactions) {
            if(reaction.user_id == req.user.id) {
                publication.meReaction = reaction;
            }
        }
    
        //if
        if(publication.user_id == req.user.id) {
            publication.valiUser = true;
        }

        const viewPubli = publication;

        res.render('publication/view-publication',{viewPubli});
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
    
}

publiControl.formEditPublication = async (req,res) => {
    try {
        const {id} = req.params;

        const publication = await Publication.findById(id);
    
        if(publication.user_id != req.user.id) {
            req.flash('error_msg','not Authorized');
            res.redirect('/');
        }else {
            res.render('publication/form-update',{publication});
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
  
}

publiControl.editPublication = async (req,res) => {
    try {
        const {id} = req.params;
        const {title,sub_title,description} = req.body;
        const publication = await Publication.findById(id);
    
        const publi = {
            title: myComple.deleteSpace(title),
            sub_title: myComple.deleteSpace(sub_title),
            description: myComple.deleteSpace(description)
        }
        
        if(publication.user_id != req.user.id) {
            req.flash('error_msg','not Authorized');
            res.redirect('/');
        }else {
            if(!title) {
                req.flash('error_msg','The title es required');
                res.redirect('/publication/edit/' + id);
            }else {
                await Publication.findByIdAndUpdate(id,{$set: publi},{new: true});
                req.flash('success_msg','The publication updated successfully');
                res.redirect('/publication/' + id);
            }
        }    
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
   
}

publiControl.deletePublication = async (req,res) => {
    try {
        const {id} = req.params;
        const publication = await Publication.findById(id);
    
        if(publication.user_id != req.user.id) {
            req.flash('error_msg','not Authorized');
        }else {
            const multimedia = await Multimedia.findOne({all_id: id});
            const comments = await Comment.find({all_id: id});

            await fs.unlink(path.resolve(`./src/public/${multimedia.path}`));

            for(const comment of comments) {
                await Reaction.deleteMany({all_id: comment._id});
            }

            await Publication.findByIdAndRemove(id);
            await Multimedia.findOneAndRemove({all_id: id});
            await Comment.deleteMany({all_id: id});
            await Reaction.deleteMany({all_id: id});

            req.flash('success_msg','Publication deleted successfully');
        }
        res.redirect('/');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
 
}

//Comment
publiControl.viewComments = async (req,res) => {
    const {idPubli} = req.params;
    const listComments = await Comment.find({all_id: idPubli}).lean();

    for(const comment of listComments) {
        const user = await User.findById(comment.user_id).lean();
        const reactions = await Reaction.find({all_id: comment._id}).lean();
    
        comment.user = user;
        comment.reactions = reactions.length;
        comment.dateAgo = format(comment.createdAt);
    
        //for
        for(const reaction of reactions) {
            if(reaction.user_id == req.user.id) {
                comment.meReaction = reaction;
            }
        }
    
        //if
        if(comment.user_id == req.user.id) {
            comment.commentUser = true;
        }
    }
    listComments.sort((a,b) => b.createdAt - a.createdAt);
    
    res.json({listComments});
}

publiControl.createComment = async (req,res) => {
    try {
        const Msg = [];
        const {puId,description} = req.body;

        const newComment = new Comment({
            description: myComple.deleteSpace(description),
            user_id: req.user.id,
            all_id: puId
        })
    
        if(!description) {
            Msg.push({text_error:'Nesessary the description'});
        }else {
            await newComment.save();
            Msg.push({text_success:'Comment created successfully'});
        }  
        res.json({Msg});

    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }

}

publiControl.viewComment = async (req,res) => {
    try {
        const Msg = [];
        const {id} = req.params;
        const comment = await Comment.findById(id).lean();
        const user = await User.findById(comment.user_id).lean();

        comment.user = user;

        if(comment.user_id == req.user.id) {
            comment.commentUser = true;
        }

        if(req.user.id != comment.user_id) {
            Msg.push({text_error:'Not autorized'});
            res.json({Msg});
        }else {
            res.json({comment});
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }

}

publiControl.editComment = async (req,res) => {
    try {
        const Msg = [];
        const {id} = req.params;
        const {description} = req.body;
        const comment = await Comment.findById(id);

        const editComment = {
            description: myComple.deleteSpace(description)
        }

        if(req.user.id != comment.user_id) {
            Msg.push({text_error:'Not autorized'});
        }else {
            if(!description) {
                Msg.push({text_error:'The description is obligatory'});
            }else {
                await Comment.findByIdAndUpdate(id,{$set: editComment},{new: true});
                
                Msg.push({text_success:'The comment updated successfully'});
            }
        }
        res.json({Msg});
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

publiControl.deleteComment = async (req,res) => {
    try {
        const Msg = [];
        const {id} = req.params;
        const comment = await Comment.findById(id);

        if(req.user.id != comment.user_id) {
            Msg.push({text_error:'Not autorized'});
        }else {
            await Reaction.deleteMany({all_id: comment._id});
            await Comment.findByIdAndRemove(comment._id);

            Msg.push({text_success:'The comment deleted successfully'});
        }
        res.json({Msg});
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }

}

//Reaction
publiControl.reaction = async (req,res) => {
    try {
        const model = {};
        const {idAll} = req.params;
        const reactions = await Reaction.find({all_id: idAll}).lean();
        const meReaction = await Reaction.findOne({user_id: req.user.id,all_id: idAll});

        model.reactions = reactions.length;
        model.meReaction = meReaction;

        if(model.meReaction) {
            await Reaction.findByIdAndRemove(model.meReaction._id);
        }else {
            const newReaction = new Reaction({
                description: 'like',
                user_id: req.user.id,
                all_id: idAll
            });
            await newReaction.save();
        }
        res.json({model});
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

//Exports
module.exports = publiControl;