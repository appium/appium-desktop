import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, Button } from 'antd';
import InspectorStyles from './Inspector.css';
import { debounce, isEqual, clone } from 'lodash';

export default class SourceScrollButtons extends Component {

  constructor () {
    super();
    this.checkShowScrollButtons = this.checkShowScrollButtons.bind(this);
    this.debouncedCheckShowScrollButtons = debounce(this.checkShowScrollButtons, 300);
    this.state = {};
  }

  componentDidMount () {
    this.checkShowScrollButtons();
    this.expandedPaths = clone(this.props.expandedPaths);
    window.addEventListener('resize', this.debouncedCheckShowScrollButtons);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedCheckShowScrollButtons);
  }

  componentDidUpdate () {
    // If the expandedPaths changed, check if we need to show the scroll buttons
    if (!isEqual(this.props.expandedPaths, this.expandedPaths)) {
      this.debouncedCheckShowScrollButtons();
      this.expandedPaths = clone(this.props.expandedPaths);
    }
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
