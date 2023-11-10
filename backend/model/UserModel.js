const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  // Add more fields for your requirements
});

const User = mongoose.model('User', userSchema);

module.exports = User;
