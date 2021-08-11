import React from 'react';
import MyCard from './card.js'
import '../css/index.css'

class AddSpot extends React.Component {
    async componentDidMount() {
        await this.props.dataProvider()
    }

    render() {
        let { error, isLoaded, result } = this.props;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {

            var cards = result.map((res, ind) => {
                return <MyCard key={ind} handleClick={() => this.props.handleAddLoc(ind)} cimg={res.preview.source} title={res.name} content={res.wikipedia_extracts.text} wikiLink={res.wikipedia} />
            })

            return (
                <div id='addSpot'>
                    <h1 className='card-title'>Places you would like to visit on the way!</h1>
                    <div className='card-container'>
                        {cards}
                    </div>
                </div>
            );
        }
    }
}

export default AddSpot