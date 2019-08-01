import * as React from 'react'

type myProps = {
  list: any,
  child: any //Need to pass data back to parent;
}

type myState = {
  nonDuplicates: any,
}

export default class RestaurantList extends React.Component<myProps, myState>{
  constructor(props:any){
    super(props)
    this.state = {
      nonDuplicates: []
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
    let restaurantAddress = (e.target.parentNode.childNodes[0].innerText).slice(9,);
    for (let obj in this.state.nonDuplicates){
      if (this.state.nonDuplicates[obj][0] === restaurantAddress){
        this.props.child(this.state.nonDuplicates[obj][1])
      }
    }
  }


  render(){
    return (
      this.state.nonDuplicates.map((item:Array<String>) => {
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
                <li>Distance from you: {item[10]} miles</li>
              :null}
              <p onClick={this.handleClick}>Want estimated nutrional facts?</p>
            </ul>
          </div>
        )
      })
    )
  }
}