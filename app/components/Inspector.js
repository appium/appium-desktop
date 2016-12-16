import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'antd';
import Screenshot from './Inspector/Screenshot';
import SelectedElement from './Inspector/SelectedElement';
import Source from './Inspector/Source';
import InspectorStyles from './Inspector.css';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod({methodName: 'source'});
    this.props.bindAppium();
  }

  render () {
    const {screenshot, selectedElement = {}} = this.props;
    const {path} = selectedElement;

    return <div className={InspectorStyles['inspector-container']}>
      <div className={InspectorStyles['screenshot-container']}>
          {screenshot && <Screenshot {...this.props} />}
      </div>
      <div className={InspectorStyles['source-tree-container']}>
        <Card title='Source' className={InspectorStyles['source-tree-card']}>
          <Source {...this.props} />
          {path && <SelectedElement {...this.props}/>}
        </Card>
      </div>
    </div>;
  }
}
