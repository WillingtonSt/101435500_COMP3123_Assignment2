const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({

username: {
    type: String,
    required: true
},

email: {
    type: String,
    required: true
},

password: {
    type: String,
    required: true
},

created_at: {
    type: Date,
    default: Date.now()
},
updated_at: {
    type: Date,
    default: Date.now()
}


});

const User = mongoose.model('User', userSchema);
module.exports = User;