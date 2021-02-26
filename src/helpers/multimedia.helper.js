const path = require('path');
const fs = require('fs-extra');

const multimediaHelper = {};

multimediaHelper.icon = async (req,res,next) => {
    const Msg = [];
    if(!req.file) {
        return next();
    }else {
        const {mimetype,size,originalname} = req.file;
        const typeFile = /jpg|jpeg|png/;
        const mimeType = typeFile.test(mimetype);
        const extName = typeFile.test(path.extname(originalname).toLowerCase());
        const multiPathtemp = req.file.path;

        if(!mimeType || !extName) {
            Msg.push({text_error: 'Invalid format'});
        }
        if(size < 4000 || size > 100000) {
            Msg.push({text_error: 'max 3mb,min 700kb'});
        }
        if(Msg.length > 0) {
            await fs.unlink(multiPathtemp);
            res.json({Msg});
        }else { 
            return next();
        }
    }
}

multimediaHelper.fondo = async (req,res,next) => {
    const Msg = [];
    if(!req.file) {
        return next();
    }else {
        const {mimetype,size,originalname} = req.file;
        const typeFile = /jpg|jpeg|png/;
        const mimeType = typeFile.test(mimetype);
        const extName = typeFile.test(path.extname(originalname).toLowerCase());
        const multiPathtemp = req.file.path;

        if(!mimeType || !extName) {
            Msg.push({text_error: 'Invalid format'});
        }
        if(size < 4000 || size > 10000000000) {
            Msg.push({text_error: 'max 10mb,min 1mb'});
        }
        if(Msg.length > 0) {
            await fs.unlink(multiPathtemp);
            res.json({Msg});
        }else { 
            return next();
        }
    }
}

multimediaHelper.publication = async (req,res,next) => {
    const Msg = [];
    if(!req.file) {
        req.flash('error_msg','Necessary image');
        res.redirect('/publication/create');
    }else {
        const {mimetype,size,originalname} = req.file;
        const typeFile = /jpg|jpeg|png/;
        const mimeType = typeFile.test(mimetype);
        const extName = typeFile.test(path.extname(originalname).toLowerCase());
        const multiPathtemp = req.file.path;

        if(!mimeType || !extName) {
            Msg.push({text_error: 'Invalid format'});
        }
        if(size < 4000 || size > 1000000000) {
            Msg.push({text_error: 'max 5mb,min 700kb'});
        }
        if(Msg.length > 0) {
            await fs.unlink(multiPathtemp);
            res.json({Msg});
        }else { 
            return next();
        }
    }
}

//Exports
module.exports = multimediaHelper;