import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Axios, * as axios from 'axios';
import Potentials from './components/Potentials'


type MyState = {
   latitude: Number,
   longitude: Number,
   needsBox: Boolean,
   location: string,
   possibleLocations: Array<String>,
   actualID: any,
   restaurantObj: Object
}

class App extends React.Component<{}, MyState> {
  constructor(props:any){
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      needsBox: false,
      location: '',
      possibleLocations: [],
      actualID: 0,
      restaurantObj: {}
    }
    this.geo = this.geo.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addLatLon = this.addLatLon.bind(this);
    this.objToArray = this.objToArray.bind(this);
    this.childData = this.childData.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.stringToNumberArr = this.stringToNumberArr.bind(this);
    this.sendingEntityId = this.sendingEntityId.bind(this);
  }

  componentDidMount(){
    this.geo();
  }

  geo(){
    //Use first arg in callback to update state w/ longitude+latitude+whether or input is needed if user allows geolocation.
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos.coords.latitude, pos.coords.longitude)
      let lat: Number = pos.coords.latitude;
      let lon: Number = pos.coords.longitude
      this.setState({
        latitude: lat,
        longitude: lon,
        needsBox: false,
      })
      //If person wants to use geolocation, we send latitude and longitude to server.
      this.addLatLon();
    //If there is an error w/ geolocation, we change state, so needsBox is true.
    }, (err) => {
      if (err) {
        this.setState({
          needsBox: true
        })
      }
    })
  }

  changeCity(event: any){
    this.setState({
      location: event.target.value
    })
  }

  addLatLon(){
    let latSplitLon: string = (this.state.latitude.toString()+','+this.state.longitude.toString())
    fetch('/', {
      method: 'POST',
      //Why does 'application/x-www-form-urlencoded' work but not json? is it because latSplitLon isnt in json format
      //potentially its lets us use just strings/nonjson.
      headers: {
        'Content-type': "application/json"
      },
      body: JSON.stringify({'city':latSplitLon})
    })
    .then((res: any) => {
      return res.json();
    })
    .then((json: Object) => {
      this.setState({
        restaurantObj: json
      })
    })
    .catch((err:any) => {
      console.error(err);
    })
  }

  handleSubmit(event: any){
    event.preventDefault();
    let location = this.state.location
    console.log(location)
    fetch('/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({'city':location})
    })
    .then((a: any) =>{
      return a.json();
    })
    .then((json: Object) => {
      let convertedArray:any = this.objToArray(json);
      this.setState({
        possibleLocations: convertedArray,
      })
    })
  }

  objToArray(obj:any){
    let bigArr = [];
    for (let prop in obj) {
      let smallArr = [];
      smallArr.push(prop);
      smallArr.push('\t')
      smallArr.push(obj[prop]);
      bigArr.push(smallArr);
      smallArr = [];
    }
    return bigArr;
  }

  childData(val:string){
    let idsString = (val.split('[')[1])
    let id = (val.split('$')[1])
    let actualAddress = (val.split('$')[0])
    let altered = this.stringToNumberArr(idsString);
    // this.setState({
    //   actualID: altered[Number(id)],
    //   //Setting possibleLocations to emptyArr gets rid of cities from DOM
    //   possibleLocations: []
    // })
    this.sendingEntityId(altered[Number(id)]);
  }

  sendingEntityId(id:Number){
    fetch('/', {
      method: 'POST',
      //Why does 'application/x-www-form-urlencoded' work but not json? is it because latSplitLon isnt in json format
      //potentially its lets us use just strings/nonjson.
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({'city':id})
    })
    .then((res:any) => {
      console.log('sEI: ',res);
      console.log(res.json());
    })
    // .then((res: any) => {
    //   return res.json();
    // })
    // .then((json: Object) => {
    //   console.log(json)
    //   // this.setState({
    //   //   restaurantObj: json
    //   // })
    // })
    // .catch((err:any) => {
    //   console.error(err);
    // })
  }


  stringToNumberArr(strArr:String){
    let arr = []
    let splitOnComma = strArr.split(',')
    for (let i=0; i<splitOnComma.length;i++){
      arr.push(Number(splitOnComma[i]))
    }
    return arr;
  }

    //Now they wont see the entityID
  cleanUp(x:any){
    for (let i=0; i<x.length; i++){
      (x[i][2].splice(1,1))
    }
    return x
  }

  render() {
    //We check if needsBox is true, if it is then we start w/ a form and text box.
    return (
      <div>
        {this.state.needsBox ?
            <form onSubmit={this.handleSubmit} >
                Location: <input type="text" onChange={this.changeCity}/> <br />
                <input type="submit" />
            </form>
          : null}
        {this.state.possibleLocations.length > 0 ?
          <div>
            <h1>We think you live in...</h1>
            <h3>Click your location</h3>
            <Potentials locations={(this.state.possibleLocations)} child={this.childData}/>
          </div>
        : null}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))