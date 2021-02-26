const {Schema,model} = require('mongoose');
const {ObjectId} = Schema.Types;

const publicationSchema = new Schema({
    title: {type: String, required: true},
    sub_title: {type: String},
    description: {type: String},
    views: {type: String},
    user_id: {type: ObjectId,required: true}
},{
    timestamps: true
});

//Exports
module.exports = model('publication',publicationSchema);