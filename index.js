// importing libraries 
const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); //for development only
const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');
const UUID = require('uuid');

// intitializing the app 
const app = express();

const s3 = new AWS.S3({
  accessKeyId: 'your-aws--key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'your-aws-region-config'
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'meda-hunt',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      const extension = file.mimetype.split('/')[1]; // gets the extension
      fileName = `${UUID.v4()}.${extension}`;
      cb(null, fileName);
    }
  })
})

app.post('/upload', upload.array("filepond"), function (req, res, next) {
  res.send(req.files[0].location);
});

//introducing helmet security middleware
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.listen(3020, () => console.log('Running on localhost:' + 3020));