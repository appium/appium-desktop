import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, Button } from 'antd';
import InspectorStyles from './Inspector.css';
import { debounce } from 'lodash';

export default class SourceScrollButtons extends Component {

  constructor () {
    super();
    this.checkShowScrollButtons = this.checkShowScrollButtons.bind(this);
    this.debouncedCheckShowScrollButtons = debounce(this.checkShowScrollButtons, 100);
    this.state = {};
  }

  componentDidMount () {
    this.checkShowScrollButtons();
    window.addEventListener('resize', this.debouncedCheckShowScrollButtons);
    this.props.container.addEventListener('click', this.debouncedCheckShowScrollButtons);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedCheckShowScrollButtons);
    this.props.container.removeEventListener('click', this.debouncedCheckShowScrollButtons);
  }

  scroll (amount) {
    const cardBody = this.props.container.querySelector('.ant-card-body');
    const maxScroll = cardBody.scrollWidth - cardBody.clientWidth;
    const scrollLeft = cardBody.scrollLeft + amount;

    // Change scroll left, make it no lower than 0 and no higher than maxScroll
    if (scrollLeft > maxScroll) {
      cardBody.scrollLeft = maxScroll;
    } else if (scrollLeft < 0) {
      cardBody.scrollLeft = 0;
    } else {
      cardBody.scrollLeft = scrollLeft;
    }

    this.checkShowScrollButtons();
  }

  // Show the scroll buttons if the provided container is scrollable
  checkShowScrollButtons () {
    const cardBody = this.props.container.querySelector('.ant-card-body');
    const maxScroll = cardBody.scrollWidth - cardBody.clientWidth;
    this.setState({
      disableScrollLeft: cardBody.scrollLeft > 0,
      disableScrollRight: cardBody.scrollLeft < maxScroll,
      show: cardBody.scrollWidth > cardBody.clientWidth
    });
  }

  render () {
    return  this.state.show ? <div className={InspectorStyles['scroll-buttons']}>
      <Button disabled={!this.state.disableScrollLeft} onClick={() => this.scroll(-20)}><Icon type='left' /></Button>
      <Button disabled={!this.state.disableScrollRight} className={InspectorStyles['scroll-right']} onClick={() => this.scroll(20)}><Icon type='right' /></Button>
    </div> : null;
  }
}
