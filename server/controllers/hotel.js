import User from "../models/user";
import Hotel from "../models/hotel";
import Order from '../models/order'
import fs from "fs";
export const create = async (req, res) => {
  console.log("Hotel fields====>", req.fields);
  console.log("Hotel files====>", req.files);
  try {
    let fields = req.fields;
    let files = req.files;

    let hotel = new Hotel(fields);
    hotel.postedBy = req.user._id;
    //handle Image
    if (files.image) {
      hotel.image.data = fs.readFileSync(files.image.path);
      hotel.image.contentType = files.image.type;
    }

    const result = await hotel.save();
    return res.json(result);
  } catch (err) {
    console.log("Error in Create Hotel==>", err);
    res.status(400).json({
      err: err.message,
    });
  }
};

export const hotels = async (req, res) => {
  // take max 24 data as response

  let all = await Hotel.find({to:{$gte: new Date()}})
    .limit(24)
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();

  res.json(all);
};

export const image = async (req, res) => {
  let hotel = await Hotel.findById(req.params.hotelId).exec();
  if (hotel && hotel.image && hotel.image.data !== null) {
    res.set("Content-Type", hotel.image.contentType);
    return res.send(hotel.image.data);
  }
};

export const sellerHotels = async (req, res) => {
  let all = await Hotel.find({ postedBy: req.user._id })
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();

  res.send(all);
};

export const remove = async (req, res) => {
  let removed = await Hotel.findByIdAndDelete(req.params.hotelId)
    .select("-image.data")
    .exec();
  res.json(removed);
};

export const read = async (req, res) => {
  let hotel = await Hotel.findById(req.params.hotelId)
    .populate("postedBy", "_id name")
    .select("-image.data")
    .exec();
  console.log("SINGLE HOTEL", hotel);
  res.json(hotel);
};

export const update = async (req, res) => {
  try {
    let fields = req.fields;
    let files = req.files;

    let data = { ...fields };

    if (files.image) {
      let image = {};
      image.data = fs.readFileSync(files.image.path);
      image.contentType = files.image.type;

      data.image = image;
    }

    let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, {
      new: true,
    }).select("-image.data");
    res.json(updated);
  } catch (err) {
    console.log(err);
    re.status(400).send("Hotel update failed. Try again");
  }
};

export const userHotelsBookings =async (req,res)=>{
  console.log("In User Hotel Bookings");
   const all= await Order.find({orderedBy:req.user._id}).select('session').populate('hotel','-image.data').populate('orderedBy',"_id name").exec();
   console.log("all user hotel bookings", all);
   return res.json(all);
} 

export const isAlreadyBooked =async (req,res)=>{
  console.log("In isAlreadyBooked");
   const {hotelId} = req.params;
  
   //find orders of the currently logged in user
   const userOrders= await Order.find({orderedBy: req.user._id}).select("hotel").exec();

   console.log("USER ORDERS==>",userOrders);

   //check if hotelid is found in userOrders array
   let ids= [];
   for( let i=0;i<userOrders.length;i++){
      ids.push(userOrders[i].hotel.toString());
   }

   console.log("IDS===>",ids);
   console.log("hotelId",hotelId);

   return res.json({
     ok:ids.includes(hotelId),
   });
} 
export const searchListings =async (req,res)=>{
   const {location,bed,date}= req.body;

   //convert string to array
   const fromDate=date.split(",");
   console.log("From DAte: ",fromDate)
   let result = await Hotel.find({
     location,
     bed,
     to:{$gte:new Date(fromDate[0])},         //to is >=  (from input)
     from:{$lte:new Date(fromDate[1])},       //from is <= (to input)
    }).select("-image.data").exec();

   res.json(result);
} 


export const checkOrderPresent =async (req,res)=>{
  console.log("In CheckOrderPresent");
   const {hotelId} = req.params;
  
   //find orders of the currently logged in user
   const hotelOrders= await Order.find({hotel: hotelId}).exec();

   console.log("Hotel ORDERS==>",hotelOrders);
   
   if(hotelOrders.length){
     return res.json({
       ok:true,
     })
   }
   else{
    return res.json({
      ok:false,
    })
   }
 
}