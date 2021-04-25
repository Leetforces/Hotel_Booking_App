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

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
