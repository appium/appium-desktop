import React, { Component } from 'react';
import { Tree, Spin } from 'antd';

const { TreeNode } = Tree;

export default class Source extends Component {

  isIgnoredAttr (attrMap) {
    let name = attrMap.name;
    return name === 'class' || name === 'text' || name === 'package';
  }

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
    const { source, setExpandedPaths, expandedPaths, selectedPath } = this.props;

    const selectedPathArr = [selectedPath];

    let recursive = (elemObj) => {
      if (!elemObj) return null;

      return elemObj.children.map((el) => {
        return <TreeNode title={this.getFormattedTag(el)} key={el.path}>
          {recursive(el)}
        </TreeNode>;
      });
    };

    return <Tree 
      onExpand={setExpandedPaths} autoExpandParent={false} expandedKeys={expandedPaths}
      onSelect={(selectedPaths) => this.handleSelectElement(selectedPaths[0])} selectedKeys={selectedPathArr}>
      {recursive(source)}
    </Tree>;
  }
}
