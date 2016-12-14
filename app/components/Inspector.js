import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Input, Card } from 'antd';
import Source from './Inspector/Source';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod({methodName: 'source'});
    this.props.bindSessionDone();
  }

  renderHighlighterRects () {
    const highlighterRects = [];
    const {selectedPath, source, setHoveredElement, unsetHoveredElement, hoveredPath, selectElement} = this.props;

    let recursive = (node, zIndex = 0) => {
      let {bounds} = node.attributes || {};
      if (bounds) {
        // Parse the bounds from string to array
        bounds = bounds.split(/\[|\]|,/).filter((str) => str !== '');

        // Calculate top, height and width
        let left = bounds[0] / this.scaleRatio;
        let top = bounds[1] / this.scaleRatio;
        let width = (bounds[2] - bounds[0]) / this.scaleRatio;
        let height = (bounds[3] - bounds[1]) / this.scaleRatio;
        let backgroundColor = hoveredPath === node.path ? 'yellow' : (selectedPath === node.path ? 'blue' : '');
        let visibility = (selectedPath === node.path || hoveredPath === node.path) ? '' : 'hidden';
        let position = 'absolute';
        let cursor = 'pointer';
        let opacity = 0.5;

        let containerStyle = {zIndex, left, top, width, height, opacity, position, cursor};
        let style = {backgroundColor, position: 'relative', width: '100%', height: '100%', visibility};

        highlighterRects.push(<div onMouseOver={() => setHoveredElement(node.path)}
          onMouseOut={unsetHoveredElement} 
          onClick={() => selectElement(node.path)}
          style={containerStyle}>
          <div style={style}></div>
        </div>);
      }

      node.children.forEach((childNode) => recursive(childNode, zIndex + 1));
    };

    recursive(source);
    return highlighterRects;
  }

  componentDidUpdate () {
    let screenshotEl = ReactDOM.findDOMNode(this).querySelector('#appium-screenshot');
    if (screenshotEl) {
      this.scaleRatio = screenshotEl.naturalHeight / screenshotEl.offsetHeight;
    }
  }


  render () {
    const {applyClientMethod, methodCallRequested, setInputValue, sendKeys, screenshot, selectedPath} = this.props;

    const {attributes} = this.props.selectedNode || {};

    // Translate dot separated path to xpath
    let xpath = '';
    if (selectedPath) {
      for (let index of selectedPath.split('.')) {
        xpath += `//*[${parseInt(index) + 1}]`;
      }
    }


    // Translate attributes into an array so we can iterate over it
    let attrArray = Object.keys(attributes || {}).map((attrName) => {
      return {
        name: attrName,
        value: attributes[attrName],
      };
    });

    return (<div style={{width: '100%', padding: '1em'}}>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{height: 800}} loading={!!methodCallRequested} title='Source'>
            <div style={{height: selectedPath ? 400 : 800, overflow: 'scroll', borderBottom: '1px solid black'}}>
              <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}></Button>
              <Source {...this.props} />
            </div>
            {selectedPath && <Row style={{paddingTop: '1em'}}>
              <Col span={12}>
                <Button onClick={() => applyClientMethod({methodName: 'tap', xpath})}>Tap Element</Button>
              </Col>
              <Col span={12} style={{height: 400}}>
                <table>
                {attrArray.map((attr, index) => (index % 2 === 0) ?  
                  <tr key={attr.name}>
                    <td>{attr.name}: {attr.value}</td>
                  </tr> :
                  <td>{attr.name}: {attr.value}</td>
                )}
                </table>
                <Input placeholder='Hostname' value={sendKeys} onChange={(e) => setInputValue('sendKeys', e.target.value)} />
                <Button onClick={() => applyClientMethod({methodName: 'sendKeys', xpath})}>Send Keys</Button>
              </Col>
            </Row>}
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{height: 800}} loading={!!methodCallRequested}>
            <div style={{position: 'relative'}}>
              <img id='appium-screenshot' style={{width: '100%'}} src={`data:image/gif;base64,${screenshot}`} />
              {this.renderHighlighterRects(attributes)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>);
  }
}
