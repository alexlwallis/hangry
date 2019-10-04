import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Axios, * as axios from 'axios';
import Potentials from './components/Potentials'
import FormAndData from './components/FormAndData'
import RestaurantList from './components/RestaurantList';
import Nutriton from './components/Nutrition';
import FilterRestaurants from './components/FilterRestaurants';

type MyState = {
   latitude: Number,
   longitude: Number,
   needsBox: Boolean,
   location: string,
   possibleLocations: Array<String>,
   foundLocation: any,
   restaurantObj: Object,
   haveRestaurantList: Boolean,
   ActualRestaurants: any,
   desiredCuisines: String,
   validLocation: Boolean,
   ableToFindLocation: String,
   filterOpen: Array<String>
}

export default class App extends React.Component<{}, MyState> {
  constructor(props:any){
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      needsBox: false,
      location: '',
      possibleLocations: [],
      foundLocation: false,
      restaurantObj: {},
      haveRestaurantList: false,
      ActualRestaurants: {},
      desiredCuisines: '',
      validLocation: true,
      ableToFindLocation: "",
      filterOpen: []
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
    this.FormAndDataToApp = this.FormAndDataToApp.bind(this);
    this.calculationWithHaversine = this.calculationWithHaversine.bind(this);
    this.haversineFormula = this.haversineFormula.bind(this);
    this.passBackOpenRestaurants = this.passBackOpenRestaurants.bind(this);
  };

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
      console.log("lat: ", this.state.latitude, " long: ",this.state.longitude)
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
    .then((json: Array<Object>) => {
      console.log('json: ', json)
      //If no restaurants are sent back because location cannot be found.
      if (json.length === 0){
        this.setState({
          restaurantObj: [],
          validLocation: false,
          needsBox: true
        })
      } else {
        let obj = Object.assign({}, json[0], json[1], json[2], json[3], json[4])
        //For whatever reason it doesn't want to give 100 restaurants back - gives around ~95
        this.setState({
          restaurantObj: obj,
          haveRestaurantList: true
        })
      }
    })
    .catch((err:any) => {
      console.error(err);
    })
  }

  handleSubmit(event: any){
    event.preventDefault();

    let location = this.state.location
    console.log('handleSubmit: ',location)
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
      console.log('handleSubmitJSON: ',json)
      //If we can get a result when we search for the location
      if (Object.keys(json).length > 0) {
        console.log('Found possible locations.')
        let convertedArray:any = this.objToArray(json);
        this.setState({
          possibleLocations: convertedArray
        })
      } else {
        console.log("We can't find any locations.")
        this.setState({
          possibleLocations: [],
          validLocation: false,
          ableToFindLocation: "We can't find any locations."
        })
      }
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
    console.log('idString: ',idsString, " id: ", id, " actualAddress: ", actualAddress, " altered: ", altered);
    this.setState({
      //actualID: altered[Number(id)],
      //Setting possibleLocations to emptyArr gets rid of cities from DOM
      possibleLocations: ['sent data'],
      validLocation: true,
      ableToFindLocation: "yes"
    })
    this.sendingEntityId(altered[Number(id)]);
  }

  FormAndDataToApp(val:any){
    console.log('formAndDataToApp');
    let x:any = {}
    console.log(val);

    //Checks to see if any repeats with names.
    for (let i=0; i<val.length; i++){
      if (!x.hasOwnProperty(val[i][0])){
        x[val[i][7]] = val[i]
      }
    }
    //Sets the state to non-repeat list.
    this.setState({
      ActualRestaurants: x
    },() => {
      this.calculationWithHaversine();
    })
  }

  sendingEntityId(id:Number){
    console.log(JSON.stringify({'city':id}))
    fetch('/', {
      method: 'POST',
      //Why does 'application/x-www-form-urlencoded' work but not json? is it because latSplitLon isnt in json format
      //potentially its lets us use just strings/nonjson.
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({'city': (id)})
    })
    //https://developer.mozilla.org/en-US/docs/Web/API/Body/json
    //So here we get the body of the response and reads it and parses
    //it as json, it returns a promise. And we cannot console.log()
    //this because you just get a promise obj, you need to use another .then
    //because then that will allow that promise enough time to resolve?
    .then((res:any) => {
      return (res.json());
    })
    .then((json:any) => {
      console.log('Am I here?', json)
      let obj = Object.assign({}, json[0], json[1], json[2], json[3], json[4])
      this.setState({
        validLocation: true,
        ableToFindLocation: "yes",
        restaurantObj: obj,
        haveRestaurantList: true
      })
    })
    .catch((err: any) => {
      console.error(err);
    })
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

  calculationWithHaversine(){
    //Need to check if user gave us location
    //Send his location coords here.
    let latitude = Number(this.state.latitude);
    let longitude = Number(this.state.longitude);
    if (this.state.longitude && this.state.latitude && Object.keys(this.state.ActualRestaurants).length > 0){
      for (let obj in this.state.ActualRestaurants){
        let lat = Number(this.state.ActualRestaurants[obj][8]);
        let lon = Number(this.state.ActualRestaurants[obj][9]);
        //console.log(this.haversineFormula(latitude, longitude, lat, lon))
        this.state.ActualRestaurants[obj][11] = this.haversineFormula(latitude, longitude, lat, lon)
      }
    }
    let updatedAR = this.state.ActualRestaurants;
    this.setState({
      ActualRestaurants: updatedAR
    })
  }

  haversineFormula(currentLatitude:number, currentLongitude:number, restaurantLat: number, restaurantLon: number){
    let degreesToRadians = (deg:number) => {
      return deg * (Math.PI/180)
    }
    let radius = 3961;
    let dlat:number = degreesToRadians(restaurantLat - currentLatitude);
    let dlon:number = degreesToRadians(restaurantLon - currentLongitude);
    let radianCurrentLat:number = degreesToRadians(currentLatitude);
    let radianRestaurantLat:number = degreesToRadians(restaurantLat);
    let A = (Math.sin(dlat/2) * Math.sin(dlat/2)) +
            (Math.cos(radianCurrentLat) * Math.cos(radianRestaurantLat) * Math.sin(dlon/2) * Math.sin(dlon/2))
    let c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A));
    let answer = String(radius * c).slice(0,4)
    return answer
  }

  passBackOpenRestaurants(e:any){
    let openRestaurants = e
    let totalRestaurants = Object.keys(this.state.ActualRestaurants);
    //console.log('og tR: ', totalRestaurants, "\n", "oR: ", openRestaurants);
    let x = totalRestaurants.filter(item => openRestaurants.includes(item));
    let filterOpen = [];
    for (let key in this.state.ActualRestaurants){
      if (openRestaurants.includes(key)){
        filterOpen.push(this.state.ActualRestaurants[key]);
      }
    }
    this.setState({
      filterOpen: filterOpen
    })
  }

  render() {
    //We check if needsBox is true, if it is then we start w/ a form and text box.

    //Need to make the input button clickable only when restaurantObj is populated.
    return (
      <div>
        {this.state.needsBox && this.state.possibleLocations[0] != "sent data" ?
            <form onSubmit={this.handleSubmit} >
                Location: <br></br>
                <input type="text" onChange={this.changeCity}/>
                 <br></br>
                <input type="submit" />
            </form>
        : null}

        {!this.state.validLocation && this.state.possibleLocations.length === 0 ?  <p>We couldn't find a likely location, try a big city near you or be more specific.</p> :null}

        {this.state.possibleLocations.length > 0 && this.state.possibleLocations[0] != "sent data" ?
          <div>
            <h1>We think you live in...</h1>
            <h3>Click your location</h3>
            <Potentials locations={(this.state.possibleLocations)} validLocation = {this.state.validLocation} child={this.childData}/>
            <p>If you can't find what you're looking for try another query.</p>
          </div>
        : null}


        {/* {this.state.possibleLocations.length === 1 ? */}

            {Object.keys(this.state.restaurantObj).length > 0 ?
              <FormAndData restaurants={this.state.restaurantObj} child={this.FormAndDataToApp}/>
            :null}

          {/* :null} */}

          {this.state.validLocation && Object.keys(this.state.ActualRestaurants).length > 0 ?

            <FilterRestaurants restaurants={this.state.ActualRestaurants} pb={this.passBackOpenRestaurants}/>

          :null}

          {this.state.validLocation ?
            /* Only way I could  */
            Object.keys(this.state.ActualRestaurants).length > 0 ?
              <RestaurantList list={this.state.ActualRestaurants} filter={this.state.filterOpen}/>
            :null

          : null}
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'))