const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Folder to store files

// JSON file path
const jsonFilePath = path.join(__dirname, 'files.json');

// Middleware to serve static files (uploads)
app.use(express.static('uploads'));

// Upload file endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Read current files.json
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    let files = JSON.parse(data);
    files.push({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${file.filename}`
    });

    // Save the updated files list to JSON
    fs.writeFile(jsonFilePath, JSON.stringify(files, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving file');
      }
      res.send('File uploaded successfully');
    });
  });
});

// Get file list
app.get('/files', (req, res) => {
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    const files = JSON.parse(data);
    res.json(files);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
