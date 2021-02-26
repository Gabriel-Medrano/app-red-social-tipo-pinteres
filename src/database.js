const mongoose = require('mongoose');

const {DB_URI} = process.env;

mongoose.connect(DB_URI,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(db => console.log('db is connected'))
.catch(err => console.log(err));