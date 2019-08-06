import * as React from 'react';
import { Component } from "react";


type mProps = {
  restaurants: any,
  child: any
}

type mState = {
  formAnswered: Boolean,
  typeOfCuisine: String,
  priceRange: Number,
  fineDine: Boolean,
  casualDine: Boolean,
  resOptions: Array<String>
};


export default class FormAndData extends Component<mProps, mState>{
  constructor(props:any){
    super(props)
    this.state = {
      formAnswered: false,
      typeOfCuisine: '',
      priceRange: 0,
      fineDine: false,
      casualDine: false,
      resOptions: []
    }
    this.cuisineInput = this.cuisineInput.bind(this);
    this.priceRange = this.priceRange.bind(this);
    this.casualDining = this.casualDining.bind(this);
    this.fineDining = this.fineDining.bind(this);
    this.answeredQuestions = this.answeredQuestions.bind(this);
    this.grouping = this.grouping.bind(this);
  }

  cuisineInput(e:any){
    let cuisine = (e.target.value);
    this.setState({
      typeOfCuisine: cuisine
    });
  }

  priceRange(e:any):void{
    let price = Number(e.target.value);
    this.setState({
      priceRange: price
    });
  }

  casualDining(e:any):void{
    if (e.target.value === 'Casual Dining') {
      this.setState({
        casualDine: true
      })
    }
  }

  fineDining(e:any):void{
    if (e.target.value === 'Fine Dining') {
      this.setState({
        fineDine: true
      })
    }
  }

  answeredQuestions():void{
    this.setState({
      formAnswered: true
    })
    let priceAdjusted:Array<String> = [];
    for (let obj in this.props.restaurants){
      //In api the restaurant pricing is for 2. So need to halve it.
      if (this.state.priceRange >= (this.props.restaurants[obj][2]/2)){
        priceAdjusted.push(this.props.restaurants[obj])
      }
    }
    let priceAndFormality:Array<String> = [];
    if (this.state.casualDine) {
      for (let obj in priceAdjusted){
        if (priceAdjusted[obj][6] != 'Fine Dining'){
          priceAndFormality.push(priceAdjusted[obj])
        }
      }
    }
    if (this.state.fineDine) {
      for (let obj in priceAdjusted){
        if (priceAdjusted[obj][6] === 'Fine Dining'){
          priceAndFormality.push(obj)
        }
      }
    }

    for (let i=0; i<this.props.restaurants.length; i++) {
      //console.log('xx: ',this.props.restaurants[i])
    }
    // for (let i=0; i<priceAndFormality.length; i++) {
    //   console.log(priceAndFormality[i][0])
    // }

    // console.log(Object.keys(this.props.restaurants));
    console.log('priceAndFormality: ',priceAndFormality)
    this.grouping(priceAndFormality); //Restaurants that match price/formality level

  }


  grouping(pAndF:Array<String>){
    let foodGroups:any = {
      'American': ['american', 'new american','burgers', 'fries', 'hot dogs', 'wings', 'buffalo wings', 'burger',],
      'Mexican': ['burritos', 'tacos', 'quesadillas', 'chile con carne', 'mexican', 'burrito', 'taqueria'],
      'Breakfast': ['eggs', 'pancakes', 'waffles', ],
      'Pizza': ['pizza', 'italian', 'lasagna', 'pizzeria'],
      getDiner: function() {return [this.Breakfast,this.American,'diner', 'burgers', 'fries'].flat()},
      'Japanese': ['japanese', 'sushi', 'bento box', 'ramen', 'noodles', 'asian'],
      'Indian': ['indian', 'pakistani', 'tikka masala', 'naan', 'asian'],
      'Ice Cream': ['dessert', 'ice cream', 'cake', 'dessert parlour', 'frozen yogurt'],
      getSpanish: function() {return [this.Mexican,'paella','spanish'].flat()},
      'Korean': ['korean', 'kbbq'],
      'Coffee': ['cafe', 'coffee', 'tea', 'latte', 'mocha', 'cafe, coffee and tea'],
      'Fast Food': ['fast food', 'burgers'],
      'Burmese': ['burma', 'burmese'],
      'Sandwich': ['sandwich', 'deli'],
      'Vietnamese': ['vietnamese', 'pho'],
      'Cuban': ['cuban'],
      'Hawaiian': ['hawaiian'],
      'German': ['german', 'bratwurst', 'currywurst', 'schnitzel'],
      'Thai': ['thai', 'pad thai'],
      'Donuts': ['donuts', 'doughnuts'],
      'Greek': ['greek', 'yogurt', 'moussaka', 'souvlaki', 'mediterranean'],
      'Bakery': ['bakery', 'patisserie', 'pastries', 'bread'],
      'Seafood': ['seafood', 'fish', 'salmon', 'crab', 'lobster'],
      'French': ['french', 'coq au vin', 'french onion soup'],
      'Afghan': ['afghan', 'afghanistani', 'kebab', 'naan'],
      'Turkish': ['turkish', 'baklava', 'menemen', 'yogurt', 'manti', 'shish kebab', 'kebab', 'turkish coffee'],
      'Moroccan': ['moroccan', 'couscous', 'tagine', 'zaalouk'],
      'Chinese': ['chinese', 'cantonese','dim sum', 'egg rolls', 'noodles', 'sweet and sour pork', 'kung pao chicken', 'chow mein', 'duck', 'asian'],
      getMed: function(){return [this.Pizza,'mediterranean', 'greek', 'italian', 'turkish'].flat()}
    }

    let sanitizeInput = this.state.typeOfCuisine.toLowerCase();

    var compareInputToFoodGroups:any = () => {
      let emptyArr:any = []
      for (let prop in foodGroups){
        if (typeof foodGroups[prop] === 'object'){
          console.log('obj')
          foodGroups[prop].filter((item:Array<String>) => {
            if (item.includes(sanitizeInput) && emptyArr.length === 0){
              emptyArr = (foodGroups[prop])
            }
          })
        } else if (typeof foodGroups[prop] === 'function' && emptyArr.length === 0) {
          let x = (foodGroups[prop]());
          console.log('f(x)')
          if (x.includes(sanitizeInput)){
            emptyArr = (x);
          }
        } else if (emptyArr.length === 0){
          emptyArr.push('Not found :\'(');
        }
      }
      return emptyArr;
    }

    let compareAgain = () => {
      console.log('compareAgain()')
      let x:any = compareInputToFoodGroups();
      console.log('x: ',x);
      let possibleRestaurants:Array<String> = [];
      let flattenResArray:Array<String> = [];
      for (let i=0; i<pAndF.length; i++){
        if (pAndF[i][1].includes(',')){
          pAndF[i][1].split(',').map((item) => {
            if (x.includes(item.trim().toLowerCase())){
              possibleRestaurants.push(pAndF[i])
            }
          })
        } else {
          if (x.includes(pAndF[i][1].toLowerCase())){
            possibleRestaurants.push(pAndF[i])
          }
        }
      }
      // console.log(this.props.restaurants);
      console.log('z: ',possibleRestaurants);
      return possibleRestaurants;
    }

    let x = compareAgain();
    this.props.child(x);

    this.setState({
      resOptions: compareAgain()
    })
  }

  //let foodGroups = {}
    /**
     * Person inputs what type of food they like i.e. American, Japanese etc
     *
     *  Create an object with logical groupings of food types that the person may
     *  have inputted i.e. '1':['Burgers', 'American', 'Fries', 'Hot Dogs'] - have all be lowercase?
     *  We do this around 15 times or so trying to create potential cuisine groupings
     *
     *  We then get the input from the cuisine and we change to lowercase, (maybe see if we can add an 's' to some)
     *  in order to increase likelyhood of user input matching something in the obj of arrays
     *
     *  Now we need to loop over the object of arrays. If the user input matches something within the first array it comes across
     *  with thats identical then we take that array that it found the keyword in and we use all the
     *  cuisine types/foods within that array as restaurant types the user is intrested in.
     *
     *  We get this array of cuisine types/foods the user may be interested in and try to match it against
     *  the priceAndFormality array.
     */



  render(){
    return(
      !this.state.formAnswered ?
      <div>
        <label>What sort of food do you want?</label>
        <input onChange={this.cuisineInput} type="text"></input>
        <br></br>
        <label>How much would you spend for one person?</label>
        <input onChange={this.priceRange} type="number" />
        <br></br>
        <label>Level of formality?</label>
        <br/>
        <input onChange={this.casualDining} type="checkbox" value="Casual Dining"/><label>Casual Dining</label>
        <input onChange={this.fineDining} type="checkbox" value="Fine Dining"/><label>Fine Dining</label>
        <br/>
        <button onClick={this.answeredQuestions}>Submit</button>
      </div>
      : null //<Sorting restaurants={this.props.restaurants} />
    )
  }
}