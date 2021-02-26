const path = require('path');
const fs = require('fs-extra');
const {v4: uuidv4} = require('uuid');

const userControl = {};

const User = require('../models/user.model');
const Publication = require('../models/publication.model');
const Position = require('../models/position.model');
const Multimedia = require('../models/multimedia.model');
const {myComple} = require('../helpers/index.helper');

userControl.formSignup = (req,res) => {
    try {
        res.render('user/signup');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.signup = async (req,res) => {
    try {
        const Msg = [];
        const {nick_name,email,password,confirm_password} = req.body;
    
        const newUser = new User({
            icon: '/img/icon/default/user.jpg',
            nick_name: myComple.stringAndNumber(nick_name),
            email
        });
    
        if(!nick_name || !email) {
            req.flash('error_msg','Required fields');
            res.redirect('/signup');
        }else {
            const emailUser = await User.findOne({email});
            const NickUser = await User.findOne({nick_name});
            if(emailUser) {
                Msg.push({text: 'The email existented'});
            }
            if(NickUser) {
                Msg.push({text: 'The Nick name existented'});
            }
            if(Msg.length > 0){
                res.render('user/signup',{Msg,nick_name});
            }else {
                const typeString = /[a-zA-Z]/;
                const typeNumber = /[0-9]/;
                const typeSymbol = /[@$!%*?.-]/;
                const passString = typeString.test(password);
                const passNumber = typeNumber.test(password);
                const passSymbol = typeSymbol.test(password);
    
                if(!passString || !passNumber || !passSymbol) {
                    Msg.push({text: 'Almenos una letra, un numero, un simbolo'});
                }
                if(password !== confirm_password) {
                    Msg.push({text: 'Password not coincided'});
                }
                if(password.length < 8) {
                    Msg.push({text: 'Password min 8 characteres'});
                }
                if(Msg.length > 0) {
                    res.render('user/signup',{Msg,nick_name,email});
                }else {
                    newUser.password = await newUser.encryptPassword(password);
                    const pathFileUser = path.resolve('./src/public/img/user/' + newUser.nick_name);
                    await fs.mkdir(pathFileUser);
    
                    await newUser.save();
                    req.flash('success_msg','Count created successfully');
                    res.redirect('/signin');
                }
            }
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.formSignin = (req,res) => {
    try {
        res.render('user/signin');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.signin = (req,res) => {
    try {
        res.redirect('/');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.logout = (req,res) => {
    try {
        req.logout();
        req.flash('success_msg','The count looged successfully');
        res.redirect('/');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

//crud
userControl.viewSetting = async (req,res) => {
    try {
        res.render('user/templates/setting-user');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.updateUser = async (req,res) => {
    try {
        const Msg = [];
        const {nick_name,description} = req.body;

        const user = {
            nick_name: myComple.stringAndNumber(nick_name),
            description: myComple.deleteSpace(description) 
        }

        const nickUser = await User.findOne({nick_name: user.nick_name});

        if(!nick_name) {
            Msg.push({text: 'Title requerided'});
        }
        if(nickUser) {
            if(req.user.nick_name !== user.nick_name) {
                Msg.push({text: 'The title is exitented'});
            }
        }

        if(Msg.length > 0) {
            res.render('user/templates/setting-user',{Msg});
        }else {
            await User.findByIdAndUpdate(req.user.id,{$set: user},{new: true});
            req.flash('success_msg','Perfil update successfully');
            res.redirect('/perfil/setting');
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.formUpdatePassword = (req,res) => {
    try {
        res.render('user/templates/update-password');
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.updatePassword = async (req,res) => {
    try {
        const Msg = [];
        const {password_previous,new_password,confirm_password} = req.body;
        const user = await User.findById(req.user.id);

        const editUser = {};

        const compare = await user.comparePassword(password_previous);

        if(!compare) {
            req.flash('error_msg','The password previous not coincided');
            res.redirect('/perfil/password');
        }else {
            const typeString = /[a-zA-Z]/;
            const typeNumber = /[0-9]/;
            const typeSymbol = /[@$!%*?.-]/;
            const passString = typeString.test(new_password);
            const passNumber = typeNumber.test(new_password);
            const passSymbol = typeSymbol.test(new_password);

            if(!passString || !passNumber || !passSymbol) {
                Msg.push({text: 'min one number,string,symbol'});
            }
            if(new_password !== confirm_password) {
                Msg.push({text: 'The password not coincided'});
            }
            if(new_password.length < 8) {
                Msg.push({text: 'Min 8 characteres'});
            }

            if(Msg.length > 0) {
                res.render('user/templates/update-password',{Msg});
            }else {
                editUser.password = await user.encryptPassword(new_password);

                await User.findByIdAndUpdate(req.user.id,{$set: editUser},{new: true});

                req.flash('success_msg','Password updated successfully');
                res.redirect('/perfil/' + req.user.nick_name);
            }
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }

}

userControl.searchUsers = async (req,res) => {
    const {nickName} = req.body;
    const nicks = RegExp(nickName,'i');
    const listUsers = await User.find({nick_name: nicks}).limit(5);

    res.json({listUsers});
}

//Perfil
userControl.viewMyPerfil = (req,res) => {
    try {
        res.redirect('/perfil/' + req.user.nick_name);
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.viewPerfil = async (req,res) => {
    try {  
        const {nickName} = req.params;
        const user = await User.findOne({nick_name: nickName}).lean();
        
        if(!user) {
            req.flash('error_msg','User not found');
            res.redirect('/');
        }else {
            const publications = await Publication.find({user_id: user._id}).lean();
            
            user.publications = publications;
        
            for(const publi of user.publications) {
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
        
            if(user._id == req.user.id) {
                user.valiMe = true;
            }

            //position
            const miembros = [];
            const listPositions = await Position.find({all_id: user._id}).lean();
            const mePosition = await Position.findOne({user_id: req.user.id,all_id:user._id}).lean();
        
            user.positions = listPositions;
            user.mePosition = mePosition;
        
            for(const position of listPositions) {
                const user = await User.findById(position.user_id).lean();
                user.position = position;
                miembros.push(user);
            }
            user.miembros = miembros;
            user.totalMiembros = user.miembros.length;

            user.publications.sort((a,b) => {return b.createdAt - a.createdAt});
            const perfilUser = user;

            res.render('user/templates/perfil-user',{perfilUser});
        }

    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
   
}

userControl.followUser = async (req,res) => {
        const miembros = [];
        const {nickName} = req.body;
        const user = await User.findOne({nick_name: nickName}).lean();
        const listPositions = await Position.find({all_id: user._id}).lean();
        const mePosition = await Position.findOne({user_id: req.user.id,all_id: user._id}).lean();
    
        user.positions = listPositions;
        user.mePosition = mePosition;
    
        for(const position of listPositions) {
            const user = await User.findById(position.user_id).lean();
            user.position = position;
            miembros.push(user);
        }
    
        user.miembros = miembros;

        const newFollower = new Position({
            description: 'follower',
            user_id: req.user.id,
            all_id: user._id
        });

        if(!user) {
            req.flash('error_msg','User not found');
            res.redirect('/');
        }else { 
            if(user._id == req.user.id) {
                req.flash('error_msg','No puedes seguirte a ti mismo');
            }else {
                if(user.mePosition) {
                    await Position.findByIdAndRemove(user.mePosition._id); 
                    req.flash('success_msg','Dejaste de seguir a: ' + user.nick_name);
                }else {
                    await newFollower.save();
                    req.flash('success_msg','Empezaste a seguir a: ' + user.nick_name);
                }
            }
        
            res.redirect('/perfil/' + user.nick_name);
        }
  
    
}

userControl.viewFormIcon = async (req,res) => {
    try {
        const {nickName} = req.params;

        if(nickName !== req.user.nick_name) {
            req.flash('error_msg','Not authorized');
            res.redirect('/');
        }else {
            res.render('user/templates/form-icon');
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
  
}

userControl.createIcon = async (req,res) => {
    try {
        const {id,nick_name} = req.user;
        
        if(!req.file) {
            await deletePresent(req.user.icon);
          
            await User.findByIdAndUpdate(id,{icon: '/img/icon/default/user.jpg'},{new: true});
        }else {
            await deletePresent(req.user.icon);
    
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
                all_id: req.user.id
            });
        
            await fs.rename(multiPathTemp,multiPathTarget);
            await newMultimedia.save();

            await User.findByIdAndUpdate(id,{icon: newMultimedia.path},{new: true});
        }
        req.flash('success_msg','Icon Update successfully');
        res.redirect(`/perfil/${nick_name}`)
    } catch (error) {
        if(req.file) {
            await fs.unlink(req.file.path);
        }
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
}

userControl.viewFormFondo = async (req,res) => {
    try {
        const {nickName} = req.params;

        if(nickName !== req.user.nick_name) {
            req.flash('error_msg','Not authorized');
            res.redirect('/');
        }else {
            res.render('user/templates/form-fondo');
        }
    } catch (error) {
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
 
}

userControl.createFondo = async (req,res) => {
    try {
        const {id,nick_name} = req.user;

        if(!req.file) {
            await deletePresent(req.user.fondo);
          
            await User.findByIdAndUpdate(id,{fondo: '/img/icon/default/fondo.jpg'},{new: true});
        }else {
            await deletePresent(req.user.fondo);

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
                all_id: req.user.id
            });

            await fs.rename(multiPathTemp,multiPathTarget);
            await newMultimedia.save();
    
            await User.findByIdAndUpdate(id,{fondo: newMultimedia.path},{new: true});
        }
        req.flash('success_msg','Icon Update successfully');
        res.redirect(`/perfil/${nick_name}`)
    } catch (error) {
        if(req.file) {
            await fs.unlink(req.file.path);
        }
        req.flash('error_msg','Error desconocido');
        res.redirect('/');
    }
   
}

//Exports
module.exports = userControl;

//configuration
const deletePresent = async (path_multi) => {
    const pathMulti = await Multimedia.findOne({path: path_multi});
    if(pathMulti) {
        await fs.unlink(path.resolve(`./src/public/${path_multi}`));
        await Multimedia.findOneAndRemove({path: path_multi});
    }
}