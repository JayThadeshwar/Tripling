import React from 'react';
import '../css/index.css'

function MyCard(props) {
    return (
        <div className='card'>
            <img src={props.cimg} className='card-img' alt='View of location' />
            <div className='card-body'>
                <div className='card-title'>{props.title}</div>
                <div className='card-content'>
                    {props.content}
                </div>
            </div>
            <div className='card-footer'>
                <button className='card-but'><a href={props.wikiLink} target='_blank' rel="noreferrer">More Info</a></button>
                <button className='card-but' onClick={props.handleClick}>Add location</button>
            </div>
        </div>
    );
}

export default MyCard