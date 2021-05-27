import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const accountSchema = new mongoose.Schema(
    {
        userId: { type: ObjectId, ref: "User" },
        holderName: {
          type:String,
          required:"Account holder is Reuired",
        }, 
        accountNo: {
          type:Number,
          required:"Account Number is required",
        }, 
        ifsc: {
          type:String,
          required:"Ifsc Code is required",
        }

    },
    { timestamps: true }
);

export default mongoose.model("Account", accountSchema);

