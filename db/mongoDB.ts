import { any } from "prop-types";

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hangry', {useNewUrlParser: true})

const db = mongoose.connection;

db.once('open', () => {console.log('mongoDB open.')})

let dataSchema = new mongoose.Schema({
  American: Object
})


let cuisineDB = mongoose.model('cuisineDB', dataSchema);


let American = {
  Burger: 800,
  Cheeseburger: 950,
  Fries: 400,
  mediumSoda: 200,
  smallSoda: 150,
  largeSoda: 300,
  oneWing: 100,
  grilledCheese: 370,
  hotDog: 400,
  applePieSlice: 350,
  cobbSalad: 470,
  caesarSalad: 300,
  Ribs4oz: 300,
  Steak4oz: 215
}



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
  // cuisineDB.find((err:any, res:any) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     console.log('FIND funciton!!!:  ', res);
  //     cb(null, res);
  //   }
  // })
  db.collection('cuisineDB').find().toArray((err:any, res:any) => {
    if (err) throw err;
    else cb(null, res);
  })
}

module.exports.find = find;
