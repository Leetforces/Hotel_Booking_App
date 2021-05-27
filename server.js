import express from "express";
import { readdirSync } from "fs";
import cors from "cors";

//import mongoose from "mongoose";
const morgan = require("morgan");
//configure env file
require("dotenv").config();
// connection to online database (Atlas)
require("./database/db.js");
const app= express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());



readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

if(process.env.NODE_ENV==='production'){
    //serve static files
    app.use(express.static("client/build"));

    const path= require('path');

    //for any other request that is not in routes
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}    



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
