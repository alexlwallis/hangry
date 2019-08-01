const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hangry', {useNewUrlParser: true})

const db = mongoose.connection;

db.once('open', () => {console.log('mongoDB open.')})

let dataSchema = new mongoose.Schema({
  American: Object
})


let cuisineDB = mongoose.model('cuisineDB', dataSchema);


cuisineDB.insertMany({
  American: {
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
}, (err:any) => {
  throw err;
})


// db.collection('cuisineDatabase').insertMany({
//   American: {
//     Burger: 800,
//     Cheeseburger: 950,
//     Fries: 400,
//     mediumSoda: 200,
//     smallSoda: 150,
//     largeSoda: 300,
//     oneWing: 100,
//     grilledCheese: 370,
//     hotDog: 400,
//     applePieSlice: 350,
//     cobbSalad: 470,
//     caesarSalad: 300,
//     Ribs4oz: 300,
//     Steak4oz: 215
//   }
// })

module.exports = {
  //add
}