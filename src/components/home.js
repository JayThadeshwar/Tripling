import React, { Component } from "react";
import Card from './trendingcard.js';
import manali from '../images/leh_latest.jpg';
import chennai from '../images/chennai__latest.jpg';
import shimla from '../images/shimla_latest.jpg';
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { Link } from 'react-router-dom'
import Typewriter from 'typewriter-effect';
import '../css/home.css';


function NavBar() {
    return (
        <nav>
            <ul>
                <li>
                    <span className='fas fa-umbrella-beach' style={{ fontSize: '20px' }} />
                    &nbsp;Tripling - Planning memorable trips
                </li>
            </ul>
        </nav>
    );
}

const trendingLocation = [
    {
        source: 'Manali, Himachal Pradesh, India',
        dest: 'Leh, Ladakh, India',
        sourceCords: [77.174301, 31.912800],
        destCords: [77.579498, 34.148300]
    },
    {
        source: 'Chennai, Tamil Nadu, India',
        dest: 'Munnar, Kerala, India',
        sourceCords: [80.270721, 13.082680],
        destCords: [77.061699, 10.087500]
    },
    {
        source: 'Delhi, India',
        dest: 'Shimla, Himachal Pradesh, India',
        sourceCords: [77.102493, 28.704060],
        destCords: [77.571167, 32.084206]
    }
]

//𝓨𝓸𝓾𝓻 𝓙𝓸𝓾𝓻𝓷𝓮𝔂 𝓼𝓽𝓪𝓻𝓽𝓼 𝓱𝓮𝓻𝓮!!
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: '',
            dest: '',
            sourceCords: [72.877655, 19.075983],
            destCords: [80.270721, 13.082680],
            sourceOptions: [],
            destOptions: []
        }
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleDestChange = this.handleDestChange.bind(this);
    }

    handleSourceChange(e) {
        let sopt = []
        if (e.target.value.length >= 3) {
            let url = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/'+e.target.value+'.json')
            const opt = {
                access_token: 'MAPBOX_API_KEY'
            }
            url.search = new URLSearchParams(opt).toString();            
            fetch(url)
                .then(res => res.json())
                .then(
                    (res)=>{
                        sopt = res.features.map((val,ind)=>{        
                            console.log(val)        
                            return <option key={ind} value={val.place_name}/>
                        })
                        this.setState({
                            source: e.target.value,
                            sourceOptions: sopt,
                            sourceCords: res.features[0].geometry.coordinates
                        })
                    }
                )            
        } else{
            this.setState({
                source: e.target.value,
                sourceOptions: sopt
            })
        }
    }

    async handleDestChange(e) {
        let sopt = []
        if (e.target.value.length >= 3) {
            let url = new URL('https://api.mapbox.com/geocoding/v5/mapbox.places/'+e.target.value+'.json')
            const opt = {
                access_token: 'MAPBOX_API_KEY'
            }
            url.search = new URLSearchParams(opt).toString();            
            fetch(url)
                .then(res => res.json())
                .then(
                    (res)=>{
                        sopt = res.features.map((val,ind)=>{        
                            console.log(val)        
                            return <option key={ind} value={val.place_name}/>
                        })
                        this.setState({
                            dest: e.target.value,
                            destOptions: sopt,
                            destCords: res.features[0].geometry.coordinates
                        })
                    }
                )            
        } else{
            this.setState({
                dest: e.target.value,
            })
        }
    }

    render() {
        return (
            <div >
                <NavBar />
                <center>
                    <Typewriter
                        onInit={(typewriter) => {                            
                            typewriter.typeString('<h1>Your Journey starts here!!</h1>')
                                .pauseFor(500)
                                .start();
                        }}
                        options={{
                            cursor: ''
                        }}

                    />

                    <div className="forbg">

                        <table className="forspace">
                            <tbody>
                                <tr>
                                    <td>
                                        <h1><FaLocationArrow /> Source</h1>
                                    </td>
                                    <td>
                                        <input list='sourceList' className="txtbox" placeholder="Starting From" onKeyUp={this.handleSourceChange} />
                                        <datalist id='sourceList'>
                                            {this.state.sourceOptions}
                                        </datalist>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h1><FaMapMarkerAlt /> Destination</h1>
                                    </td>
                                    <td>
                                        <input list='destList' className="txtbox" placeholder="Destination" onKeyUp={this.handleDestChange} />
                                        <datalist id='destList'>
                                            {this.state.destOptions}
                                        </datalist>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan='2' align='center'>
                                        <Link
                                            to={{
                                                pathname: '/plan',
                                                state: {
                                                    source: this.state.source,
                                                    dest: this.state.dest,
                                                    sourceCords: this.state.sourceCords,
                                                    destCords: this.state.destCords,
                                                }
                                            }}
                                            className='pBut'
                                        >
                                            PLAN
                                        </Link>
                                    </td>
                                </tr>    
                                </tbody>                        
                        </table>
                    </div>
                </center>
                <br />
                <center><h1>𝓣𝓻𝓮𝓷𝓭𝓲𝓷𝓰 𝓣𝓻𝓲𝓹𝓼</h1></center>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                    <Card
                        title='Manali to Leh'
                        distance='479 Kms'
                        imageUrl={manali}
                        body='It spans a length of 479 km with a mean altitude in between 3 to 4 km above sea level. The road is open for about 5 months a year mostly during summers and mid-October. The journey takes about 2 days with one stopover for rest and acclimatisation.'
                        duration='2 Days'
                        locationInfo={trendingLocation[0]}
                    />
                    <Card
                        title='Chennai to Munnar'
                        distance='585 Kms'
                        imageUrl={chennai}
                        body='If you have  got a weekend and Chennai weather just dont cut it, Munnar is your escape.There are three different routes which you can take from Chennai to Munnar. 
                All three routes comprise of amazing attractions to make your road trip more memorable.'
                        duration='10 to 12 hours'
                        locationInfo={trendingLocation[1]}
                    />
                    <Card
                        title='Delhi to Shimla'
                        distance='342 Kms'
                        imageUrl={shimla}
                        body=' Take the Grand Trunk Road from Delhi and trudge along for a long weekend away from the cacophony of the city. 
                The journey takes about 6 hours and 40 minutes. Give your stomach a treat at Sukhdev ka Dhaba at Murthal for their sumptuous paranthas!'
                        duration='7 hours'
                        locationInfo={trendingLocation[2]}
                    />
                </div>
            </div>
        )
    }
}
export default Home;
