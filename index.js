<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>File Upload & Download</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    input[type="file"] { margin-bottom: 10px; }
    ul { list-style: none; padding: 0; }
    li { margin-bottom: 5px; }
  </style>
</head>
<body>
  <h2>Upload a File</h2>
  <form id="uploadForm" enctype="multipart/form-data">
    <input type="file" name="file" required />
    <button type="submit">Upload</button>
  </form>

  <h3>Uploaded Files:</h3>
  <ul id="fileList"></ul>

  <script>
    // Upload form
    document.getElementById('uploadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      alert(await res.text());
      loadFiles();
    });

    // Load uploaded file list
    async function loadFiles() {
      const res = await fetch('/files');
      const files = await res.json();
      const list = document.getElementById('fileList');
      list.innerHTML = '';
      files.forEach(file => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = file.path;
        link.textContent = file.originalName;
        link.download = file.originalName;
        li.appendChild(link);
        list.appendChild(li);
      });
    }

    loadFiles(); // auto-load files on page load
  </script>
</body>
</html>
