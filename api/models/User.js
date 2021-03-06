const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String,
    subscribersCount: {
      type: Number,
      default: 0
    },
    subscribers: [
      {
          type: mongoose.Schema.ObjectId,
          ref: "User"
      }
    ],
}, {timestamps: true});

userSchema.pre("save", function(next){
    const user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if(err){ return next(err); }

        bcrypt.hash(user.password, salt, null, (err, hash) => {
        if(err) { return next(err);}
        user.password = hash;
        return next();
      });
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err){ return callback(err)}

        return callback(null, isMatch);
    });
};

module.exports = mongoose.model("User", userSchema);
