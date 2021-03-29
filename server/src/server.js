import express from 'express';
import fs from 'fs';
const app = express();

//database connection
require("./database/db");

// require('morgan') not import , otherwise get deprecated warning
const morgan = require('morgan');
// import cors(cross-origin-resource-sharing)
import cors from 'cors';

// configure environmental variable
require('dotenv').config();
const PORT = process.env.PORT || 2000;

//middleware
//in terminal after request: GET /api/lfjhsdhj 200 2.418 ms - 23
app.use(morgan("dev")); //development mode
app.use(cors());
// to get json data that are request as POST request.
app.use(express.json());

//router middleware
// const router =  require('./routes/auth');
// app.use('/api',router);

//auto loading all routes
//path from root folder (./src/routes)
fs.readdirSync('./src/routes').map((value) => {
    //use path from current file
    return app.use("/api", require(`./routes/${value}`));
    //for using require, all file in routes must export as (module.exports= routesName;)
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log(`Server is running at port ${PORT}`);
    }
})