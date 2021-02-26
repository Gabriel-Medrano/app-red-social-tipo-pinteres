const {Schema,model} = require('mongoose');
const {ObjectId} = Schema.Types;

const reactionSchema = new Schema({
    description: {type: String},
    user_id: {type: String, required: true},
    all_id: {type: ObjectId, required: true}
},{
    timestamps: true
});

//Exports
module.exports = model('reaction',reactionSchema);