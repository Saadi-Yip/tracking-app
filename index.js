const express = require("express");
require("./db");
const app = express();
const hpp = require("hpp");
const path = require("path");
const cors = require("cors"); 
const helmet = require("helmet")
const xss = require('xss-clean');
const PORT = process.env.PORT || 5050; 
require('dotenv').config('./env/.env');
const routes = require('./routes/index');  
const bodyParser = require('body-parser'); 
const rateLimit = require('express-rate-limit');
const expressSanitize = require('express-mongo-sanitize');
const { invalidRoute, rateLimits } = require("./utils/constants");

/************** Middlewares ****************/
app.use(helmet());
app.use(express.static(path.resolve('./public')));
app.use(express.json({limit: '10kb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitize());
app.use(xss());
app.use(hpp());
app.use(express.static('public'));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
});

let corsOptions = {
    origin: '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));
 
const limiter = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message: `{${rateLimits}}`
});
app.use("/", limiter);

/************** Routes ****************/
app.use('/' ,routes); /*** Application Route ***/  
app.all('*', (req,res,next) =>{
  res.send({message: `${invalidRoute}`});
});

/*** Listen to Port ***/
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
module.exports = app;

