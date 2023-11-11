import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: trusted,
  }
);
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
    return next()
    this.password=bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
        jwt.sign({
            _id:this._id,
            email:this.emal,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
        )
}
userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,

    },
    process.env.REFRESH_TOKEN_SCRET,
    {
        expiresIn:REFRESH_TOKEN_EXPIRY
    }
   
    )
}
export const User = mongoose.model("User", userSchema);
