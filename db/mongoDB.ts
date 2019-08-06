import { any } from "prop-types";

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hangry', {useNewUrlParser: true})

const db = mongoose.connection;

db.once('open', () => {console.log('mongoDB open.')})

let dataSchema = new mongoose.Schema({
  American: Object
})


let cuisineDB = mongoose.model('cuisineDB', dataSchema);


let American = {American: [{
  Burger: 800,
  Cheeseburger: 950,
  Fries: 400,
  "Medium Soda": 200,
  "Small Soda": 150,
  "Large Soda": 300,
  "One Buffalo Wing": 100,
  "Grilled Cheese": 370,
  "Hot Dog": 400,
  "Slice of Apple Pie": 350,
  "Cobb Salad": 470,
  "Caesar Salad": 300,
  "4 ounces of Ribs": 300,
  "4 ounce Steak": 215
}]}



// cuisineDB.deleteMany({}, (err:any) => {
//   if (err) {
//     throw err;
//   } else {
//     cuisineDB.insert({'hello':'world'}, (err:any) => {
//       if (err) {
//         throw err;
//       }
//     })
//   }
// })
db.collection('cuisineDB').deleteMany({}, (err:any) => {
  if (err) {
    throw err;
  } else {
    db.collection('cuisineDB').insertOne(American, (err:any, res:any) => {
      if (err) {throw err}
      else {console.log('dbCollection: ',res.ops[0])};
    })
  }
})



export function find(cb:Function){
  db.collection('cuisineDB').find().toArray((err:any, res:any) => {
    if (err) throw err;
    else cb(null, res);
  })
}

module.exports.find = find;
