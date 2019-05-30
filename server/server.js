const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 1234

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));

app.listen(port, () => console.log(`Express server running at ${port}`))