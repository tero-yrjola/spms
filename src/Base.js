import React, {Component} from 'react';
import './App.css';
import Portfolio from "./Portfolio/Portfolio";

class Base extends Component {
    render() {
        return (
            <div className="Base">
                <Portfolio name={"Testiportfolio"}/>
            </div>
        );
    }
}

export default Base;
