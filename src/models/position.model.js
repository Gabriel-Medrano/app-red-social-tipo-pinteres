const {Schema,model} = require('mongoose');
const {ObjectId} = Schema.Types;

const positionSchema = new Schema ({
    description: {type: String, required: true},
    user_id: {type: ObjectId ,required: true},
    all_id: {type: ObjectId, required: true}
},
{
    timestamps: true
});

//Exports
module.exports = model('position',positionSchema);