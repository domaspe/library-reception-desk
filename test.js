const express = require('express');
const os = require('os');
const path = require('path');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const fs = require('fs');

const app = express();
app.use('/thumbnails', express.static(path.join(__dirname, 'data/thumbnails')));

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
