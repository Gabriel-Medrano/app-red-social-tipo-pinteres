const bcrypt = require('bcryptjs');
const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    icon: {type: String,required: true},
    fondo: {type: String, required: true, default: '/img/icon/default/fondo.jpg'},
    nick_name: {type: String, required: true,unique: true},
    email: {type: String, required: true},
    description: {type: String},
    password: {type: String, required: true}
}, {
    timestamps: true
});

//encrypt
userSchema.methods.encryptPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass,salt);
}

//compare
userSchema.methods.comparePassword = async function (pswd) {
    return bcrypt.compare(pswd,this.password);
}

//Exports
module.exports = model('user',userSchema);
