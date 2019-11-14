import React from 'react';

// SocketContext = {Provider, Consumer}
const SocketContext = React.createContext(null); 

export class SocketProvider extends React.Component {

    render() {
        console.log(this.props.socket,"socket provider")
        return (
            <SocketContext.Provider value="12345">
                {this.props.children}
            </SocketContext.Provider>
        );
    }
}

export function withSocketContext(Component) {

  class ComponentWithSocket extends React.Component {
      static displayName = `${Component.displayName ||
        Component.name}`;


      render() {
          return (
              <SocketContext.Consumer>
                  { socket =>  {console.log(socket,"withsocketcontext");return(<Component {...this.props}  socket={socket} ref={this.props.onRef} />) }}
              </SocketContext.Consumer>
          );
      }
  }
  
  return ComponentWithSocket;
}

