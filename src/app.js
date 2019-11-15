// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

// pull in our routes
const router = require('./router.js');


//Setup port and mongoose/mongo
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/ImageUpload';
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

//Setup express
const app = express();

//Host hosted folder as /assets (so we get access to /assets/index.html)
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

//Hookup the compression package
app.use(compression());

//Add the file upload package. This will place all uploaded files into req.files
app.use(fileUpload());

//Hookup body parser to parse post request.
app.use(bodyParser.urlencoded({
  extended: true,
}));

//Turnoff the x-powered-by header in responses
app.disable('x-powered-by');

//Add cookie parser
app.use(cookieParser());

//Send the app to the router
router(app);

//Start up the app
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});