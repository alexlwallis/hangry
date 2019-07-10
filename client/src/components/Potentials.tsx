import * as React from 'react';
import { Component } from "react";

type Props = {
  locations: any
  child: any
}

type State = {
  actualLocation: String,
  cleanLocations: Array<String>,
  restaurantIDs: Array<Number>
}


export default class Potentials extends Component<Props, State>{
  constructor(props:any){
    super(props)
    this.state = {
      actualLocation: '',
      cleanLocations: [],
      restaurantIDs: []
    }
    this.handleClick = this.handleClick.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.getIDs = this.getIDs.bind(this);
  }

  componentDidMount(){
    this.getIDs(this.props.locations)
    this.cleanUp(this.props.locations)
  }

  handleClick(e:any){
    let loc = e.target.innerText
    let id = e.target.id
    this.setState({
      actualLocation: loc+' id: '+id
    })
    let resIds = this.state.restaurantIDs;
    this.props.child(loc+'$'+id+ '$ q: '+'['+resIds);
  }

  cleanUp(x:any){
    for (let i=0; i<x.length; i++){
      (x[i][2].splice(1,1))
    }
    this.setState({
      cleanLocations: x
    })
  }

  getIDs(x:any){
    let z = []
    for (let i=0; i<x.length; i++){
      //slice won't let you push it into z.
      z.push(x[i][2].splice(1,1))
    }
    this.setState({
      restaurantIDs: z
    })
  }

  render(){
    return (
      this.state.cleanLocations.map((item:any, i:any) => {
        return (
          <div>
            <p onClick={this.handleClick} key={i} id={i}>{item}</p>
          </div>
        )
      })
    )
  }
}