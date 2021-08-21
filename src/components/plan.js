import React from 'react';

import NavBar from './navbar.js'
import Map from './map.js'
import AddSpot from './addspot.js'
import MyModal from './modal.js'

import '../css/index.css';

const openTripMap = 'OPENTRIP_API_KEY';

async function getCardData(setXids) {
  let urlX = 'https://api.opentripmap.com/0.1/en/places/xid/'
  const optionsX = {
    apikey: openTripMap
  }

  var finRes = []
  for (let i = 0; i < setXids.length; i++) {
    let furl = new URL(urlX + setXids[i])
    furl.search = new URLSearchParams(optionsX).toString()
    let data = await fetch(furl)
    let finData = await data.json()
    finRes.push(finData)
  }

  return finRes
}

class ContainerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyModalOpen: false,
      error: null,
      isLoaded: false,
      result: [],
      response: {},
      markers: [],
      locationInfo : this.props.location.state
    }
  }

  openModal() {
    this.setState({
      isMyModalOpen: !this.state.isMyModalOpen
    });
  }

  async getDataHandler() {
    const obj = this.state.locationInfo
    const options = {
      lon_min: Math.min(obj.sourceCords[0], obj.destCords[0]),
      lon_max: Math.max(obj.sourceCords[0], obj.destCords[0]),
      lat_min: Math.min(obj.sourceCords[1], obj.destCords[1]),
      lat_max: Math.max(obj.sourceCords[1], obj.destCords[1]),
      rate: 3,
      limit: 15,
      kinds: 'historic_architecture,natural,cultural,interesting_places',
      apikey: openTripMap
    }
    let url = new URL('http://api.opentripmap.com/0.1/en/places/bbox')
    url.search = new URLSearchParams(options).toString();

    var response = await fetch(url);
    var res = await response.json()

    var listOfXids = [];
    var arrOfWikiIds = [];
    for (let i = 0; i < res.features.length; i++) {
      if (!arrOfWikiIds.includes(res.features[i].properties.wikidata)) {
        listOfXids.push(res.features[i].properties.xid)
        arrOfWikiIds.push(res.features[i].properties.wikidata)
      }
    }
    listOfXids = listOfXids.slice(0, 8);

    var cardData = await getCardData(listOfXids)
    console.log(cardData)
    console.log(res)
    this.setState({
      isLoaded: true,
      result: cardData,
      response: res
    });
  }

  handleLocClick(i) {
    let obj = this.state.result[i]
    let markerLngLat = []
    let name = obj.wikipedia_extracts.title
    markerLngLat.push(obj.point.lon)
    markerLngLat.push(obj.point.lat)
    const markerInfo = {
      lnglat: markerLngLat,
      name: name
    }
    let existMarker = this.state.markers.slice()
    existMarker.push(markerInfo)
    this.setState({
      markers: existMarker
    })
  }

  render() {
    const modalSty = this.state.isMyModalOpen ? { display: 'block' } : { display: 'none' };
    const modalButSty = this.state.isMyModalOpen ? { display: 'none' } : { display: 'block' };

    return (
      <div>
        <NavBar />
        <Map source={this.state.locationInfo.source} dest={this.state.locationInfo.dest} markers={this.state.markers} />
        <button className='planBut' onClick={() => this.openModal()} style={modalButSty}>Start Planning</button>
        <MyModal modalSty={modalSty} openModal={() => this.openModal()} />
        <AddSpot
          error={this.state.error}
          isLoaded={this.state.isLoaded}
          result={this.state.result}
          dataProvider={() => this.getDataHandler()}
          handleAddLoc={(i) => this.handleLocClick(i)}
        />
      </div>
    );
  }
}

export default ContainerPage;
