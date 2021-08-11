import React from 'react';

function MyModal(props) {
    return (
        <div className='myModal' style={props.modalSty}>
            <div className='modalHead'>
                <span>Explore</span>
                <button onClick={() => props.openModal()}>X</button>
            </div>
            <div className='modalBody'>
                <button className='modalBut'><a href='#addSpot'>Add attraction</a></button>
                <button className='modalBut'><a href='#addSpot'>Add hotels</a></button>
                <button className='modalBut'><a href='#addSpot'>Add tourist services</a></button>
            </div>
        </div>
    );
}

export default MyModal