
const publicYpriControl = {};

const Publication = require('../models/publication.model');
const User = require('../models/user.model');
const Multimedia = require('../models/multimedia.model');

//Publics
publicYpriControl.index = async (req,res) => {
    try {
        if(req.user) {
            const listPubli = await Publication.find().lean();

            for(const publi of listPubli) {
                const user = await User.findById(publi.user_id).lean();
                const multimedia = await Multimedia.findOne({all_id: publi._id}).lean();

                publi.user = user;
                publi.multimedia = multimedia;

                //for

                //if
                if(publi.user_id == req.user.id) {
                    publi.valiUser = true;
                }
            }
            listPubli.sort((a,b) => {b.createdAt - a.createdAt});
            res.render('publication/view-publications',{listPubli});
        }else {
            res.render('publicYpri/publics/index');
        }   
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
  
}

publicYpriControl.about = (req,res) => {
    try {
        res.render('publicYpri/publics/about');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

publicYpriControl.politics = (req,res) => {
    try {
        res.render('publicYpri/publics/politics');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

//Privates

//Exports
module.exports = publicYpriControl;