import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav>
            <ul>
                <li>                    
                    <span className='fas fa-umbrella-beach' style={{ fontSize: '20px'}} />
                    <Link 
                        style={{color:'white', textDecoration:'none'}}
                        to='/'
                    >
                        &nbsp;Tripling - Planning memorable trips
                    </Link>

                </li>
                <li>
                    <span className='fas fa-save' style={{ fontSize: '20px' }} />
                    &nbsp;Save my plan
                </li>
            </ul>
        </nav>
    );
}

export default NavBar