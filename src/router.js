//Import our controllers
const file = require('./controllers/files.js');

//Setup our router
const router = (app) => {
  //Images get uploaded using /upload
  app.post('/upload', file.upload);
  
  //Images can be retrieved using /retrieve?name=THE_FILE_NAME_WITH_EXTENSION
  app.get('/retrieve', file.retrieve);
};

module.exports = router;