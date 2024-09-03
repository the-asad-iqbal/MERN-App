import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   avatar: {
      type: String,
      required: false,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
   },
   refreshToken: {
      type: String,
      required: false,
      default: null,
   },
});

userSchema.pre("save", async (next) => {
   if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(16);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
   }
   next();
});

userSchema.methods.matchPassword = async (enteredPassword) => {
   return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateRefreshToken = async () => {
   const refreshToken = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
   });
   return refreshToken;
};

const User = mongoose.model("User", userSchema);
export { User };
