import * as React from 'react';
import { Component } from "react";


type mProps = {
  restaurants: any
}

type mState = {
  formAnswered: Boolean,
  typeOfCuisine: String,
  priceRange: Number,
  fineDine: Boolean,
  casualDine: Boolean
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
      if (this.state.priceRange >= (this.props.restaurants[obj][2])){
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
          priceAndFormality.push(priceAdjusted[obj])
        }
      }
    }
    console.log(priceAndFormality)
    this.grouping();
  }


  grouping(){
    let foodGroups:any = {
      'American': ['american', 'burgers', 'fries', 'hot dogs', 'wings', 'buffalo wings'],
      'Mexican': ['burritos', 'tacos', 'quesadillas', 'chile con carne'],
      'Breakfast': ['eggs', 'pancakes', 'waffles'],
      'Pizza': ['pizza', 'italian', 'lasagna'],
      getDiner: function() {return this.foodGroups.Breakfast + this.foodGroups.American+ 'diner', 'burgers', 'fries'},
      'Japanese': ['japanese', 'sushi', 'bento box', 'ramen'],
      'Indian': ['indian', 'pakistani', 'tikka masala', 'naan'],
      'Ice Cream': ['dessert', 'ice cream', 'cake'],
      getSpanish: function() {return this.foodGroups.Mexican + ['paella', 'spanish']},
      'Korean': ['korean', 'kbbq'],
      getMed: function(){return this.foodGroups.Italian + ['mediterranean', 'greek', 'italian']}
    }
    let sanitizeInput = this.state.typeOfCuisine.toLowerCase();

    for (let prop in foodGroups){

    }

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
        <label>Max price you would spend for one person?</label>
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