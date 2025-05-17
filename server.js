const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
const jsonFile = path.join(__dirname, 'files.json');

// បង្កើត folders ឬ file បើមិនទាន់មាន
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(jsonFile)) fs.writeFileSync(jsonFile, '[]');

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// បង្ហាញ HTML និង uploads
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// API: Upload
app.post('/upload', upload.single('myFile'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  // Save filename to files.json
  const existing = JSON.parse(fs.readFileSync(jsonFile));
  existing.push(req.file.filename);
  fs.writeFileSync(jsonFile, JSON.stringify(existing, null, 2));

  res.redirect('/');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
