// Import the filestore model/schema
const filedb = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
}

// Our upload controller
const uploadFile = (req, res) => {
  // If there are no files, return an error
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  // Otherwise, grab the file we are looking for
  // This name (sampleFile) comes from the html form's input
  const { sampleFile } = req.files;

  // Have the model create an image with this data
  const imageModel = new filedb.FileModel(sampleFile);

  // Save the image to mongo
  const savePromise = imageModel.save();

  // When it is finished saving, let the user know
  savePromise.then(() => {
    res.json({ message: 'upload successful' });
  });

  // If there is an error while saving, let the user know
  savePromise.catch((error) => {
    res.json({ error });
  });

  // Return out
  return savePromise;
};

// Our retrieval controller
const retrieveFile = (req, res) => {
  if(!req.query.fileName){
   return res.status(400).json({ error: 'Missing file name' }); 
  }
  
  // Find the file by name in the database if it exists
  filedb.FileModel.findOne({ name: req.query.fileName }, (error, doc) => {
    // If there is an error let the user know
    if (error) {
      return res.status(400).json({ error });
    }

    // if there is no doc, return an error
    if (!doc) {
      return res.status(400).json({ error: 'File not found' });
    }

    // If there is a doc, setup the mimetype and file size
    res.writeHead(200, {
      'Content-Type': doc.mimetype,
      'Content-Length': doc.size,
    });

    // Finally send back the image data
    return res.end(doc.data);
  });
};

module.exports.uploadPage = uploadPage;
module.exports.uploadFile = uploadFile;
module.exports.retrieveFile = retrieveFile;
