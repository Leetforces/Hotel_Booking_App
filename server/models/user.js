import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

// schema of the DataBaseS
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is Required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is Required",
      unique: true,
    },
    password: {
      type: String,
      required: "Password is Required",
      min: 6,
      max: 64,
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    resetToken: {
      type: String,
    },
    expireToken: {
      type: Date,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;
  // hashing only when password is changed by user or
  // is registering for the first time
  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log("Bcrypt HASH Error: ", err);
        return next(err);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      console.log("Comare Password Error");
      // return callback function with error &
      // false meaning password doesnot match
      return next(err, false);
    }
    // if no error, we get null and match
    // is if the password matches of not
    console.log("Matched Password", match);
    return next(null, match);
  });
};

export default mongoose.model("User", userSchema);
