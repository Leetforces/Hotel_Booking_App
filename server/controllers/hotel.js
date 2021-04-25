import User from "../models/user";
import Hotel from '../models/hotel';
import fs from 'fs';
export const create= async (req,res)=>{
   console.log("Hotel fields====>", req.fields);
   console.log("Hotel files====>", req.files);
   try{
       let fields =req.fields;
       let files= req.files;

       let hotel= new Hotel(fields);
       hotel.postedBy=req.user._id;
       //handle Image
       if(files.image){
         hotel.image.data= fs.readFileSync(files.image.path);
         hotel.image.contentType = files.image.type;
       }
       
       const result= await hotel.save();
       return res.json(result);

   }catch(err){
      console.log("Error in Create Hotel==>",err);
      res.status(400).json({
         err: err.message,
      })
   }
}

export const hotels = async(req,res) =>{
   let all = await Hotel.find({}).limit(24).select('-image.data').populate('postedBy','_id name').exec();
   res.json(all);

}