import { any } from "prop-types";

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hangry', {useNewUrlParser: true})

const db = mongoose.connection;

db.once('open', () => {console.log('mongoDB open.')})

let dataSchema = new mongoose.Schema({
  American: Object
})


let cuisineDB = mongoose.model('cuisineDB', dataSchema);


let cuisines = {
  American:[{
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
  }],
  //https://www.verywellfit.com/how-to-eat-healthy-mexican-food-3495715
  //https://www.abuelos.com/dbcwp/wp-content/uploads/2018/07/Abuelos-Nutritional-Information.pdf
  Mexican: [{
    'Grilled Chicken Fajitas': 400,
    'Beef Enchiladas': 1290,
    'Chicken Enchiladas': 960,
    'Beef Burrito': 980,
    'Chicken Burrito': 840,
    'Bean and Cheese Taco': 300,
    'Cheese Quesadilla': 900,
    'Steak Chimicanga': 1300,
    'Chips and Salsa': 320,

    'Guacamole': 350,
    "Medium Soda": 200,
    "Small Soda": 150,
    "Large Soda": 300,
    'Margarita': 300,
    'Sangria': 350,
    'Full Sopapilla': 540
  }]

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
    db.collection('cuisineDB').insertOne(cuisines, (err:any, res:any) => {
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
