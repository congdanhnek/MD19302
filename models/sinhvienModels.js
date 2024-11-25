const mongoose = require('mongoose');
const Schema = mongoose.Schema; //schema= collection
const ObjectId = Schema.ObjectId;
const Sinhvien = new Schema({
    id: { type: ObjectId }, // khóa chính
    name: {type: String},
    averagescore : {type: Number},
    old: {type: Number},
    subject:{type: String}
    


});
module.exports = mongoose.models.Sinhvien || mongoose.model('Sinhvien', Sinhvien);