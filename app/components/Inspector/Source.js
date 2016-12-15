import React, { Component } from 'react';
import { Tree, Button } from 'antd';
import InspectorStyles from '../Inspector.css';

const {TreeNode} = Tree;

export default class Source extends Component {

  getFormattedTag (el) {
    const {tagName} = el;
    return `<${tagName}>`;
  }i

  handleSelectElement (path) {
    const {selectElement, unselectElement} = this.props;

    if (!path) {
      return unselectElement();
    }

    // Dispatch the selectElement event
    selectElement(path);
  }

  render () {
    const {source, setExpandedPaths, expandedPaths, selectedPath, applyClientMethod} = this.props;

    const selectedPathArr = [selectedPath];

    let recursive = (elemObj) => {
      if (!elemObj) return null;

      return elemObj.children.map((el) => {
        return <TreeNode title={this.getFormattedTag(el)} key={el.path}>
          {recursive(el)}
        </TreeNode>;
      });
    };

    return <div>
      <div className={InspectorStyles['tree-container']} style={{height: selectedPath ? 400 : 800}}>
        <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}></Button>
        <Tree   
          onExpand={setExpandedPaths} autoExpandParent={false} expandedKeys={expandedPaths}
          onSelect={(selectedPaths) => this.handleSelectElement(selectedPaths[0])} selectedKeys={selectedPathArr}>
          {recursive(source)}
        </Tree>
      </div>
    </div>;
  }
}
