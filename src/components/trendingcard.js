import React from 'react';
import { Link } from 'react-router-dom';
import '../css/card.css';

function Card({ title, imageUrl, body, distance, duration, locationInfo }) {
    return (
        <div className="card-contain">
            <div className="image-conatiner">
                <img src={imageUrl} alt="Card Background" />
            </div>
            <div className="card-con">
                <div className="card-head">
                    <center><h2>{title}</h2></center>
                </div>
                <div>
                    <b>About</b><p>{body}</p>
                </div>
                <div className="card-distance">
                    <p><b>Distance</b>     {distance}</p>
                </div>
                <div className="card-duration">
                    <p><b>Duration</b>     {duration}</p>
                </div>
            </div>
            <div className="btn">
                <button>
                    <Link
                        to = {{
                            pathname: '/plan',
                            state: locationInfo
                        }}
                    >
                        View More
                    </Link>
                </button>
            </div>
        </div>
    )
}
export default Card;