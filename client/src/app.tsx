import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props:any){
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0
    }
    this.geo = this.geo.bind(this);
  }


  geo(){
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos.coords.latitude, pos.coords.longitude)
      let lat: Number = pos.coords.latitude;
      let lon: Number = pos.coords.longitude
      this.setState({
        latitude: lat,
        longitude: lon
      })
    })
  }


  render() {
    return (
      <div>
        Hello World! React + TypeScript!
        <button onClick={this.geo}>Press me.</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))