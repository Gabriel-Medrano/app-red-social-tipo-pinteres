const {format} = require('timeago.js');

const helper = {};

helper.timeAgo = (time) => {
    return format(time);
}

//Exports
module.exports = helper;