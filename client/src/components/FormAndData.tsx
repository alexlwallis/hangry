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
  resOptions: Array<String>,
  inputError: String,
  cuisineDropDown: Array<String>,
  hasReceievedCuisineDropD: Boolean,
  propsCuisine: Array<String>
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
      resOptions: [],
      inputError: "",
      cuisineDropDown: [],
      hasReceievedCuisineDropD: false,
      propsCuisine: []
    }
    this.cuisineInput = this.cuisineInput.bind(this);
    this.priceRange = this.priceRange.bind(this);
    this.casualDining = this.casualDining.bind(this);
    this.fineDining = this.fineDining.bind(this);
    this.answeredQuestions = this.answeredQuestions.bind(this);
    this.grouping = this.grouping.bind(this);
    this.extractCuisineTypesFromProps = this.extractCuisineTypesFromProps.bind(this);
    this.elementsOfFoodGroups = this.elementsOfFoodGroups.bind(this);
    this.matchPropsAndFG = this.matchPropsAndFG.bind(this);
  }

  //May want to consider putting in a dropdown menu w/ combination of
  //cuisine types from possible location and from foodGroups object.
  componentWillUpdate(){
    //If components has ran and we've got the props to go
    //without the if it'll just run recursively.
    if (!this.state.hasReceievedCuisineDropD){
      this.matchPropsAndFG();
    }
  }


  cuisineInput(e:any){

    console.log('e: ',e);

    let cuisine = (e.target.value);

    console.log('cuisine: ', cuisine);

    let wordCheckBoolean = (cuisine.match(/[a-zA-Z]/g) != null) && (cuisine.match(/[a-zA-Z]/g).length === cuisine.length)

    if (wordCheckBoolean || cuisine === ""){
      this.setState({
        inputError: "",
        typeOfCuisine: cuisine
      });
      //error handling
    } else {
      this.setState({
        inputError: "Cuisine input must be an alphabetical word."
      });
    }
  }

  priceRange(e:any):void{
    let price = (e.target.value);

    let priceCheckBoolean = (price.match(/\d/g) != null) && (price.match(/\d/g).length === price.length)

    console.log(price === 0);

    if (priceCheckBoolean || price === ""){
      this.setState({
        priceRange: Number(price),
        inputError: ""
      });
    } else {
      this.setState({
        inputError: "Must use only numbers for amount spent."
      });
    }
  }

  casualDining(e:any):void{
    console.log('e.target.value: ', e.target.value);
    if (e.target.value === 'Casual') {
      this.setState({
        casualDine: true
      })
    }
  }

  fineDining(e:any):void{
    console.log('e.target.value: ', e.target.value);

    if (e.target.value === 'Fine') {
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

    console.log('answeredQs: ',priceAndFormality,"\n",priceAdjusted,"\n", this.props.restaurants);

    // console.log(Object.keys(this.props.restaurants));
    console.log('priceAndFormality: ',priceAndFormality)
    this.grouping(priceAndFormality); //Restaurants that match price/formality level
  }

  elementsOfFoodGroups():Array<String>{
    let foodGroups:any = {
      'American': ['american', 'new american','burgers', 'fries', 'hot dogs', 'wings', 'buffalo wings', 'burger', "steak", "bbq"],
      'Mexican': ['burritos', 'tacos', 'quesadillas', 'chile con carne', 'mexican', 'burrito', 'taqueria'],
      'Breakfast': ['eggs', 'pancakes', 'waffles', ],
      'Pizza': ['pizza', 'italian', 'lasagna', 'pizzeria'],
      getDiner: function() {return [this.Breakfast,this.American,'diner', 'burgers', 'fries'].flat()},
      'Japanese': ['japanese', 'sushi', 'bento box', 'ramen', 'noodles', 'asian'],
      'Indian': ['indian', 'pakistani', 'tikka masala', 'naan', 'asian'],
      'Ice Cream': ['dessert', 'ice cream', 'cake', 'dessert parlour', 'frozen yogurt'],
      getSpanish: function() {return [this.Mexican,'paella','spanish', 'tapas'].flat()},
      'Korean': ['korean', 'kbbq'],
      'Coffee': ['cafe', 'coffee', 'tea', 'latte', 'mocha', 'cafe, coffee and tea', 'sandwich'],
      'Fast Food': ['fast food', 'burgers'],
      'Burmese': ['burma', 'burmese', 'asian'],
      'Sandwich': ['sandwich', 'deli'],
      'Vietnamese': ['vietnamese', 'pho', 'asian'],
      'Cuban': ['cuban'],
      'Lebanese': ['lebanese'],
      'Juices': ['juices'],
      'European': ['modern european', 'european'],
      'Pub Food': ['pub food'],
      'Grill': ['grill'],
      'Healthy Food': ['healthy food'],
      'Irish': ['irish','colcannon', 'full irish breakfast', 'soda bread', 'irish stew', 'fish and chips'],
      'Hawaiian': ['hawaiian'],
      'Mongolian': ['mongolian'],
      'African': ['african'],
      'German': ['german', 'bratwurst', 'currywurst', 'schnitzel'],
      'Thai': ['thai', 'pad thai', 'asian'],
      'Donuts': ['donuts', 'doughnuts'],
      'Greek': ['greek', 'yogurt', 'moussaka', 'souvlaki', 'mediterranean'],
      'Bakery': ['bakery', 'patisserie', 'pastries', 'bread', 'sandwich'],
      'Seafood': ['seafood', 'fish', 'salmon', 'crab', 'lobster'],
      'French': ['french', 'coq au vin', 'french onion soup'],
      'Afghan': ['afghan', 'afghanistani', 'kebab', 'naan'],
      'Turkish': ['turkish', 'baklava', 'menemen', 'yogurt', 'manti', 'shish kebab', 'kebab', 'turkish coffee'],
      'Moroccan': ['moroccan', 'couscous', 'tagine', 'zaalouk'],
      'Chinese': ['asian','chinese', 'cantonese','dim sum', 'egg rolls', 'noodles', 'sweet and sour pork', 'kung pao chicken', 'chow mein', 'duck', 'asian'],
      getMed: function(){return [this.Pizza,'mediterranean', 'greek', 'italian', 'turkish'].flat()}
    }
    let emptyArr:any = []
    for (let prop in foodGroups){
      if (typeof foodGroups[prop] === 'object'){
        emptyArr.push(foodGroups[prop])
      } else if (typeof foodGroups[prop] === 'function' && emptyArr.length === 0) {
        let x = (foodGroups[prop]());
        emptyArr.push(x);
      }
    } return emptyArr.flat();
  }

  extractCuisineTypesFromProps():Array<String>{
    let allCuisineTypes:Array<String> = [];
    for (let key in this.props.restaurants){
      let cuisineString = this.props.restaurants[key][1];
      let cuisineArray = cuisineString.split(",");
      //console.log('cuisineArray: ', cuisineArray);
      cuisineArray.map((item:any) => allCuisineTypes.push(item.trim()));
    }
    let unique = [...new Set(allCuisineTypes)];
    return unique;
  }


  matchPropsAndFG(){
    let unique = this.extractCuisineTypesFromProps();
    let keywords = this.elementsOfFoodGroups();
    console.log('unique: ', unique, '\n', "keywords: ", keywords);
    let match:Array<String> = [];
    for (let i=0; i<unique.length; i++) {
      for (let j=0; j<keywords.length; j++) {
        if (unique[i].toLowerCase() === keywords[j].toLowerCase()){
          match.push(unique[i]);
        }
      }
    }
    //await match; //= [...new Set(match)];
    match = [...new Set(match)];
    console.log('match', match);
    //if (match.length > 0) {
      this.setState({
        cuisineDropDown: match,
        hasReceievedCuisineDropD: true
      })
    //}
  }


  grouping(pAndF:Array<String>){
    let foodGroups:any = {
      'American': ['american', 'new american','burgers', 'fries', 'hot dogs', 'wings', 'buffalo wings', 'burger', "steak", "bbq"],
      'Mexican': ['burritos', 'tacos', 'quesadillas', 'chile con carne', 'mexican', 'burrito', 'taqueria'],
      'Breakfast': ['eggs', 'pancakes', 'waffles', ],
      'Pizza': ['pizza', 'italian', 'lasagna', 'pizzeria'],
      getDiner: function() {return [this.Breakfast,this.American,'diner', 'burgers', 'fries'].flat()},
      'Japanese': ['japanese', 'sushi', 'bento box', 'ramen', 'noodles', 'asian'],
      'Indian': ['indian', 'pakistani', 'tikka masala', 'naan', 'asian'],
      'Ice Cream': ['dessert', 'ice cream', 'cake', 'dessert parlour', 'frozen yogurt'],
      getSpanish: function() {return [this.Mexican,'paella','spanish', 'tapas'].flat()},
      'Korean': ['korean', 'kbbq'],
      'Coffee': ['cafe', 'coffee', 'tea', 'latte', 'mocha', 'cafe, coffee and tea', 'sandwich'],
      'Fast Food': ['fast food', 'burgers'],
      'Burmese': ['burma', 'burmese', 'asian'],
      'Sandwich': ['sandwich', 'deli'],
      'Vietnamese': ['vietnamese', 'pho', 'asian'],
      'Cuban': ['cuban'],
      'Lebanese': ['lebanese'],
      'Juices': ['juices'],
      'European': ['modern european', 'european'],
      'Pub Food': ['pub food'],
      'Grill': ['grill'],
      'Healthy Food': ['healthy food'],
      'Irish': ['irish','colcannon', 'full irish breakfast', 'soda bread', 'irish stew', 'fish and chips'],
      'Hawaiian': ['hawaiian'],
      'Mongolian': ['mongolian'],
      'African': ['african'],
      'German': ['german', 'bratwurst', 'currywurst', 'schnitzel'],
      'Thai': ['thai', 'pad thai', 'asian'],
      'Donuts': ['donuts', 'doughnuts'],
      'Greek': ['greek', 'yogurt', 'moussaka', 'souvlaki', 'mediterranean'],
      'Bakery': ['bakery', 'patisserie', 'pastries', 'bread', 'sandwich'],
      'Seafood': ['seafood', 'fish', 'salmon', 'crab', 'lobster'],
      'French': ['french', 'coq au vin', 'french onion soup'],
      'Afghan': ['afghan', 'afghanistani', 'kebab', 'naan'],
      'Turkish': ['turkish', 'baklava', 'menemen', 'yogurt', 'manti', 'shish kebab', 'kebab', 'turkish coffee'],
      'Moroccan': ['moroccan', 'couscous', 'tagine', 'zaalouk'],
      'Chinese': ['asian','chinese', 'cantonese','dim sum', 'egg rolls', 'noodles', 'sweet and sour pork', 'kung pao chicken', 'chow mein', 'duck', 'asian'],
      getMed: function(){return [this.Pizza,'mediterranean', 'greek', 'italian', 'turkish'].flat()}
    }

    let sanitizeInput = this.state.typeOfCuisine.toLowerCase();

    //let keywordsFromFoodGroups:Array<String> = [];
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
      console.log('emptyArray: ',emptyArr);
      return emptyArr;
    }
    //compareInputToFoodGroups()



    let compareAgain = () => {
      console.log('pANDf: ', pAndF);
      let x:any = compareInputToFoodGroups();
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
     console.log('compareAgain(),possibleRestaurants: ',possibleRestaurants);
      return possibleRestaurants;
    }

    let x = compareAgain();
    this.props.child(x);

    this.setState({
      resOptions: compareAgain()
    })
  }

  errorStyle = {
    "color":"red"
  }


  render(){
    return(
      !this.state.formAnswered ?
      <div>

        {this.state.cuisineDropDown.length > 0 ?
        <div>
          <label>Preferred Cuisine Type: </label>
          <br></br>
          <select>
          <option selected disabled hidden value="">Pick from drop down menu</option>
          {this.state.cuisineDropDown.map((item:any) => {
            return (
              <option onClick={this.cuisineInput} value={item}>{item}</option>
            )
          })}
          </select>
          <br></br>
          <br></br>
          <label>Maximum Cost per Person:</label> <br></br>
          <input onChange={this.priceRange} type="text" />
          <br></br>
          <br></br>
          <label>Dining Formality</label>
          <br/>
          <input onChange={this.casualDining} type="checkbox" value="Casual"/><label>Casual Dining</label>
          <input onChange={this.fineDining} type="checkbox" value="Fine"/><label>Fine Dining</label>
        </div>
        :<p>Loading restaurant selector...</p>}
        {this.state.inputError ?
          <p style={this.errorStyle}>{this.state.inputError}</p>
        :null}
        <br/>
        {console.log('restaurant props len: ',Object.keys(this.props.restaurants).length)}
        {!this.state.inputError && Object.keys(this.props.restaurants).length > 0 && this.state.cuisineDropDown.length > 0 ?
            <button onClick={this.answeredQuestions}>Find Suggested Restaurants</button>
        :null}
      </div>
      : null) //<Sorting restaurants={this.props.restaurants} />
  }
}