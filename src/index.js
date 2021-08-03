import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import CryptoJS from 'crypto-js';
import { has } from 'lodash';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW4wMyIsImEiOiJja3J1ZzVidHUwaTM4MnZvY2M1eWp2OHVuIn0.8-9M1R0lPpVbG-2utQA8JQ';
const source = 'Mumbai';
const sourceCords = [72.877655,19.075983];
const dest = 'Chennai';
const destCords = [80.270721,13.082680];
const openTripMap = '5ae2e3f221c38a28845f05b681d64e946dfd5450129b33de543db865';
let ctr = 0;

class Map extends React.Component {

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [77.947998, 23.473324],
      zoom: 4,
      scrollZoom: false
    });

    let directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving-traffic',
      routePadding: 200
    })

    directions.setOrigin(this.props.source);
    directions.setDestination(this.props.dest);

    map.addControl(directions, 'top-left');
    map.addControl(new mapboxgl.NavigationControl());
  }

  render() {
    return (
      <div 
        ref={el => (this.mapWrapper = el)} 
        className="mapWrapper" 
      />
    );
  }
}

function NavBar(){
  return (
    <nav>
      <ul>
        <li>
          <span className='fas fa-umbrella-beach' style={{fontSize:'20px'}}/>
          &nbsp;Tripling - Planning memorable trips
        </li>
        <li>
          <span className='fas fa-save' style={{fontSize:'20px'}}/>
          &nbsp;Save my plan
        </li>
      </ul>
    </nav>
  );
}

class AddSpot extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      didMainInfoLoaded: false,
      isImageLoaded: false,
      result: {},
      recommendData: {},
      imageLinks: []
    }
  }

  componentDidMount(){
    const options = {
      lon_min: Math.min(sourceCords[0],destCords[0]),
      lon_max: Math.max(sourceCords[0],destCords[0]),
      lat_min: Math.min(sourceCords[1],destCords[1]),
      lat_max: Math.max(sourceCords[1],destCords[1]),
      rate: 3,
      limit: 10,
      apikey: openTripMap
    }

    let url = new URL('http://api.opentripmap.com/0.1/en/places/bbox')
    url.search = new URLSearchParams(options).toString();

    fetch(url).then(res => res.json()).then(
      (res) => {
        this.setState({
          isLoaded: true,
          result: res
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  render(){
    const { error, isLoaded, result } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      ctr++;
      var listWikiIds = '';
      var wikiIds = [];
      for (let index = 0; index < result.features.length; index++) {
        listWikiIds += result.features[index].properties.wikidata
        wikiIds.push(result.features[index].properties.wikidata)

        if(index !== result.features.length-1)
          listWikiIds += '|'
      }        
      
      if(!this.state.didMainInfoLoaded){
        
        const wikidataOptions = {
          "action": "wbgetentities",
          "format": "json",
          "origin": "*",
          "ids": listWikiIds,
          "sites": "enwiki",
          "props": "descriptions|labels|sitelinks/urls",
          "languages": "en",
          "sitefilter": "enwiki"
        }
        const wikidataBaseUri = new URL('https://www.wikidata.org/w/api.php')
        wikidataBaseUri.search = new URLSearchParams(wikidataOptions).toString();

        fetch(wikidataBaseUri).then(res => res.json()).then(
          (res) => {
            this.setState({
              didMainInfoLoaded: true,
              recommendData: res
            });
          }
        )
      }

      if(!this.state.isImageLoaded){
        let imgLinks = [];
        for(let i = 0; i < wikiIds.length; i++){
          let imgOptions = {
            "action": "wbgetclaims",
            "format": "json",
            "origin": "*",
            "entity": wikiIds[i],
            "property": "P18"
          }
          const wikidataBaseUri = new URL('https://www.wikidata.org/w/api.php')
          wikidataBaseUri.search = new URLSearchParams(imgOptions).toString();
          fetch(wikidataBaseUri).then(res => res.json()).then(
            (res) => {
              // Constructing image link
              let tmp = res.claims.P18[0].mainsnak.datavalue.value
              tmp = tmp.trim();
              tmp = tmp.replaceAll(' ','_')
              let hash = CryptoJS.MD5(tmp).toString()
              let finLink = 'https://upload.wikimedia.org/wikipedia/commons/'+hash.substr(0,1)+'/'+hash.substr(0,2)+'/'+tmp;
              
              imgLinks.push(finLink)
            }
          )
        }
        this.setState({
          isImageLoaded: true,
          imageLinks: imgLinks
        })      
      }

      console.log(this.state.imageLinks)

      return (
        <div id='addSpot'>
          <div className='card'>            
            <img src='https://upload.wikimedia.org/wikipedia/commons/3/31/Warangal_fort.jpg' height='150' width='200' alt='Fort'/>
            <h3>Warangal fort</h3>
            <p>building in India</p>
            <div className='footer'>
              <button>Add stop</button>
              <button>Know more</button>
            </div>
            {ctr}
          </div>          
        </div>
      );
    }
    // return(
    //   <div id='addSpot'>
    //     Religious places
    //     Natural reserve
    //     Monuments
    //     Historic places,forts
    //     Cultural places - Museums (museums)
    //   </div>
    // );
  }
}

function MyModal(props){
  return(
    <div className='myModal' style={props.modalSty}>
      <div className='modalHead'>
        <span>Explore</span>
        <button onClick={()=> props.openModal()}>X</button>
      </div>
      <div className='modalBody'> 
        <button className='modalBut'><a href='#addSpot'>Add attraction</a></button>
        <button className='modalBut'><a href='#addSpot'>Add hotels</a></button>
        <button className='modalBut'><a href='#addSpot'>Add tourist services</a></button>        
      </div>
    </div>
  );
}

class ContainerPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isMyModalOpen: false
    }
  }

  openModal(){
    this.setState({
      isMyModalOpen: !this.state.isMyModalOpen
    });
  }

  render(){

    const modalSty = this.state.isMyModalOpen ? {display:'block'} : {display:'none'};
    const modalButSty = this.state.isMyModalOpen ? {display:'none'} : {display:'block'};

    return(
      <div>
        <NavBar/>
        <Map source = {source} dest = {dest}/>
        <button className='planBut' onClick={()=> this.openModal()} style={modalButSty}>Start Planning</button>
        <MyModal modalSty={modalSty} openModal={()=>this.openModal()}/>
        <AddSpot/>
      </div>
    );
  }
}

ReactDOM.render(
    <ContainerPage/>,
    document.getElementById('root')
);

{/* Religious places
          Natural reserve
          Monuments
          Historic places,forts
          Cultural places - Museums (museums) */}