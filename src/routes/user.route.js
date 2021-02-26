const {Router} = require('express');
const router = Router();

const userCtrl = require('../controllers/user.controller');
const {Auth, multer, multimedia} = require('../helpers/index.helper');

//Routes
router.get('/signup',Auth.notAuthenticated,userCtrl.formSignup);
router.post('/signup',Auth.notAuthenticated,userCtrl.signup);
router.get('/signin',Auth.notAuthenticated,userCtrl.formSignin);
router.post('/signin',Auth.notAuthenticated,Auth.login,userCtrl.signin);
router.get('/logout',Auth.isAuthenticated,userCtrl.logout);

//crud
router.get('/perfil/setting',Auth.isAuthenticated,userCtrl.viewSetting);
router.post('/perfil/setting',Auth.isAuthenticated,userCtrl.updateUser);
router.get('/perfil/password',Auth.isAuthenticated,userCtrl.formUpdatePassword);
router.post('/perfil/password',Auth.isAuthenticated,userCtrl.updatePassword);
router.post('/search/users',Auth.isAuthenticated,userCtrl.searchUsers);

//Perfil
router.get('/me',Auth.isAuthenticated,userCtrl.viewMyPerfil);
router.get('/perfil/:nickName',Auth.isAuthenticated,userCtrl.viewPerfil);
router.post('/perfil/follow',Auth.isAuthenticated,userCtrl.followUser);
router.get('/perfil/:nickName/icon',Auth.isAuthenticated,userCtrl.viewFormIcon);
router.post('/perfil/:nickName/icon',Auth.isAuthenticated,multer.single,multimedia.icon,userCtrl.createIcon);
router.get('/perfil/:nickName/fondo',Auth.isAuthenticated,userCtrl.viewFormFondo);
router.post('/perfil/:nickName/fondo',Auth.isAuthenticated,multer.single,multimedia.fondo,userCtrl.createFondo);

//Exports
module.exports = router;