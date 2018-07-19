var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = mongoose.Schema({
    user: String, 
    password: String
});

//gives user functionality to User model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);