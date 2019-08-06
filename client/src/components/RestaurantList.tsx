import * as React from 'react'

import Nutrition from './Nutrition';

type myProps = {
  list: any,
  child: any //Need to pass data back to parent;
}

type myState = {
  nonDuplicates: any,
  wantsNutrition: Boolean,
  desiredCuisines: any,
  whichRestaurant: any
}

export default class RestaurantList extends React.Component<myProps, myState>{
  constructor(props:any){
    super(props)
    this.state = {
      nonDuplicates: [],
      wantsNutrition: false,
      desiredCuisines: '',
      whichRestaurant: ''
    }
    this.revealNames = this.revealNames.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //Because props are resent for haversine distance almost immediately.
  componentWillReceiveProps(){
    this.revealNames();
  }

  revealNames():void{
    let nonDup = [];
    for (let obj in this.props.list){
      nonDup.push(Object.values(this.props.list[obj]))
    }
    this.setState({
      nonDuplicates: nonDup
    })
  }

  handleClick(e:any):void{
    this.setState({
      wantsNutrition: true
    })
    let restaurantAddress = (e.target.parentNode.childNodes[1].childNodes[0].innerText).slice(9,);
    let arrayOfPotentialCuisines = [];
    for (let obj in this.state.nonDuplicates){
      if (this.state.nonDuplicates[obj][0] === restaurantAddress){
        //console.log(this.state.nonDuplicates[obj][1])
        arrayOfPotentialCuisines.push(this.state.nonDuplicates[obj][1])
      }
    }
    // console.log('arrayOfPotentialCuisines: ',arrayOfPotentialCuisines);
    this.setState({
      desiredCuisines: (arrayOfPotentialCuisines),
      whichRestaurant: restaurantAddress
    })

  }


  render(){
    return (
      this.state.nonDuplicates.map((item:Array<String>,  i:any) => {
        return (
          <div>
            <h3>{item[7]}</h3>
            <ul>
                <li>Address:  {item[0]}</li>
              {Number(item[2]) > 0 ?
                <li>Estimated price per person: ${Number(item[2])/2}</li>
              :null}
                <li>Telephone Number: {item[4]}</li>
                <li>Opening Hours: {item[5]}</li>
                <li>Ratings: {item[3]}/5</li>
              {item[6] === 'Fine Dining' ?
                <li>Fine Dining</li>
              : <li>Casual Atmosphere</li>}
              {item[10] ?
                <li> Distance from you: {item[10]} miles</li>
              :null}
            </ul>
            <p onClick={this.handleClick}>Want estimated nutrional facts?</p>

            {/* Matches the clicked <p>'s address with the iterated nonDup map */}
            {(item[0] === this.state.whichRestaurant) ?
              <Nutrition potentialCuisines={this.state.desiredCuisines} whichRestaurant={i}/>
            :null}
          </div>
        )
      })
    )
  }
}