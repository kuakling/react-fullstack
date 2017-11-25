import React, { Component } from 'react';

let tickTimer;

class Clock extends Component {

  componentDidMount() {
    tickTimer = setInterval(() => {
      tickTimer = new Date().toLocaleDateString('th', {day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
      this.forceUpdate();
    }, 1000);
  }

  componentWillUnmount() {
    if (tickTimer) {
      clearInterval(tickTimer);
    }
  }
  

  render() {
    return (
      <div {...this.props}>
        {tickTimer}
      </div>
    );
  }
}

export default Clock;
