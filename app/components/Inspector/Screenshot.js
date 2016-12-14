import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import HighlighterRect from './HighlighterRect';

export default class Screenshot extends Component {

  constructor (props) {
    super(props);
    this.state = {
      scaleRatio: 1
    };
    this.updateScaleRatio = debounce(this.updateScaleRatio.bind(this), 1000);
  }

  updateScaleRatio () {
    let screenshotEl = this.containerEl.querySelector('img');
    this.setState({
      scaleRatio: screenshotEl.naturalHeight / screenshotEl.offsetHeight
    });
  }

  componentDidMount () {
    this.updateScaleRatio();
    window.addEventListener('resize', this.updateScaleRatio);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateScaleRatio);
  }

  render () {
    const highlighterRects = [];
    const {source, screenshot} = this.props;
    const {scaleRatio} = this.state;

    let recursive = (node, zIndex = 0) => {
      if (!node) return;
      highlighterRects.push(<HighlighterRect {...this.props} node={node} zIndex={zIndex} scaleRatio={scaleRatio} />);
      node.children.forEach((childNode) => recursive(childNode, zIndex + 1));
    };

    recursive(source);
    return <div ref={(containerEl) => this.containerEl = containerEl}>
        <img id='appium-screenshot' style={{width: '100%'}} src={`data:image/gif;base64,${screenshot}`} />}
        {highlighterRects}
    </div>;
  }
}
