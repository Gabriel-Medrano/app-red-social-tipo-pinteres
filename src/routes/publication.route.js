const {Router} = require('express');
const router = Router();

const publiCtrl = require('../controllers/publication.controller');
const {Auth,multer,multimedia} = require('../helpers/index.helper');

//Routes
router.get('/publication/create',Auth.isAuthenticated,publiCtrl.formCreatePublication);
router.post('/publication/create',Auth.isAuthenticated,multer.single,multimedia.publication,publiCtrl.createPublication);
router.get('/publication/:id',Auth.isAuthenticated,publiCtrl.viewPublication);
router.get('/publication/edit/:id',Auth.isAuthenticated,publiCtrl.formEditPublication);
router.post('/publication/edit/:id',Auth.isAuthenticated,publiCtrl.editPublication);
router.get('/publication/delete/:id',Auth.isAuthenticated,publiCtrl.deletePublication);

//Comment
router.get('/comments/:idPubli',Auth.isAuthenticated,publiCtrl.viewComments);
router.post('/comment/create',Auth.isAuthenticated,publiCtrl.createComment);
router.get('/comment/:id',Auth.isAuthenticated,publiCtrl.viewComment);
router.put('/comment/edit/:id',Auth.isAuthenticated,publiCtrl.editComment);
router.delete('/comment/delete/:id',Auth.isAuthenticated,publiCtrl.deleteComment);

//Reaction
router.get('/reaction/:idAll',Auth.isAuthenticated,publiCtrl.reaction);

//Exports
module.exports = router;