import React, {Component} from 'react';
import io from "socket.io-client";

export default class Base extends Component {
    static screen;
    constructor(props) {
        super(props);
        Base.screen = this;
    }

    nav() {
        return this.props.navigation;
    }
}
