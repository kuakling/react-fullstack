import React, { Component } from 'react';
import css from './index.scss';
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;


class Home extends Component {

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  render() {
    return (
      <div>
        <DatePicker onChange={this.onChange} />
        <br />
        <MonthPicker onChange={this.onChange} placeholder="Select month" />
        <br />
        <RangePicker onChange={this.onChange} />
      </div>
    );
  }
}

export default Home;
