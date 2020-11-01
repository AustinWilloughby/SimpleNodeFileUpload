// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

// pull in our routes
const router = require('./router.js');

// Setup port and mongoose/mongo
const port = process.env.PORT || process.env.NODE_PORT || 3000;


const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/ImageUpload';

const mongooseOptions = {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
}

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

// Setup express
const app = express();


// Hookup the compression package
app.use(compression());

// Add the file upload package. This will place all uploaded files into req.files
app.use(fileUpload());

// Hookup body parser to parse post request.
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Setup handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');

// set the views path to the template directory
// (not shown in this example but needed for express to work)
app.set('views', `${__dirname}/../views`);

// Turnoff the x-powered-by header in responses
app.disable('x-powered-by');

// Add cookie parser
app.use(cookieParser());

// Send the app to the router
router(app);

// Start up the app
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
