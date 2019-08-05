import * as React from 'react'

import Nutrition from './Nutrition';

type myProps = {
  list: any,
  child: any //Need to pass data back to parent;
}

type myState = {
  nonDuplicates: any,
  wantsNutrition: Boolean,
  desiredCuisines: any
}

export default class RestaurantList extends React.Component<myProps, myState>{
  constructor(props:any){
    super(props)
    this.state = {
      nonDuplicates: [],
      wantsNutrition: false,
      desiredCuisines: ''
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
    let restaurantAddress = (e.target.parentNode.childNodes[0].innerText).slice(9,);
    let arrayOfPotentialCuisines = [];
    for (let obj in this.state.nonDuplicates){
      if (this.state.nonDuplicates[obj][0] === restaurantAddress){
        arrayOfPotentialCuisines.push(this.state.nonDuplicates[obj][1])
      }
    }
    this.setState({
      desiredCuisines: JSON.stringify(arrayOfPotentialCuisines)
    })
  }


  render(){
    return (
      this.state.nonDuplicates.map((item:Array<String>,  i:any) => {
        return (
          <div>
            <h3 id={i}>{item[7]}</h3>
            <ul>
                <li id={i}>Address:  {item[0]}</li>
              {Number(item[2]) > 0 ?
                <li id={i}>Estimated price per person: ${Number(item[2])/2}</li>
              :null}
                <li id={i}>Telephone Number: {item[4]}</li>
                <li id={i}>Opening Hours: {item[5]}</li>
                <li id={i}>Ratings: {item[3]}/5</li>
              {item[6] === 'Fine Dining' ?
                <li id={i}>Fine Dining</li>
              : <li id={i}>Casual Atmosphere</li>}
              {item[10] ?
                <li id={i}> Distance from you: {item[10]} miles</li>
              :null}
            </ul>
            <p onClick={this.handleClick}>Want estimated nutrional facts?</p>
            {this.state.wantsNutrition === true ?
              <Nutrition potentialCuisines={this.state.desiredCuisines}/>
            :null}
          </div>
        )
      })
    )
  }
}