const {Router} = require('express');
const router = Router();

const publicYpriCtrl = require('../controllers/publicYprivate.controller');

//Routes
//Public
router.get('/',publicYpriCtrl.index);
router.get('/about',publicYpriCtrl.about);
router.get('/politics',publicYpriCtrl.politics);

//Privates

//Exports
module.exports = router;
