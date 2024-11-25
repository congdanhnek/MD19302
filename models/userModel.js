const mongoose = require('mongoose');
const Schema = mongoose.Schema; //schema= collection
const ObjectId = Schema.ObjectId;
const user = new Schema({
    id: { type: ObjectId }, // khóa chính
    username: {type: String},
    password: {type: String},
    fullname: {type: String}

});
module.exports = mongoose.models.category || mongoose.model('user', user);
