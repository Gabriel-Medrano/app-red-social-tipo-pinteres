const {Schema,model} = require('mongoose');
const {ObjectId} = Schema.Types;

const multimediaSchema = new Schema({
    filename: {type: String, required: true},
    encoding: {type: String, required: true},
    originalname: {type: String, required: true},
    mimetype: {type: String, required: true},
    path: {type: String, required: true},
    size: {type: Number, required: true},
    all_id: {type: ObjectId, required: true}, //complement,publication
});

//Exports
module.exports = model('multimedia',multimediaSchema);
