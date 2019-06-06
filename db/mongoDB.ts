const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hangry', {useNewUrlParser: true});

const db = mongoose.connection;

db.once('open', () => {console.log('mongoDB open.')})

// let dataSchema = new mongoose.Schema({

// })