const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

// Set the public folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/save', express.raw({type: "*/*", limit: '200mb'}), (req, res) => {
  const blobData = req.body; // assuming the blob data is sent in the request body
  const filename = 'canvas-made.webm'; // specify a filename for the saved blob
  // use fs.writeFile to save the blob data to a file
  fs.writeFile(filename, blobData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving blob to file');
    } else {
      res.status(200).send('Blob saved successfully');
    }
  });
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
