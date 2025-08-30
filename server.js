const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const bundlePath = path.join(__dirname, 'dist', 'main.lynx.bundle');

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve bundle file
app.get(['/', '/main.lynx.bundle'], (req, res) => {
  if (fs.existsSync(bundlePath)) {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="main.lynx.bundle"'
    );
    res.sendFile(bundlePath);
  } else {
    res.status(404).send('Bundle not found');
  }
});

const server = app.listen(port, () => {
  console.log(`Lynx bundle server listening on port ${port}`);
  console.log(`Bundle available at: http://localhost:${port}/main.lynx.bundle`);
});
