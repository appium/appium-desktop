import React, { Component } from 'react';
import { Tree, Button } from 'antd';
import InspectorStyles from '../Inspector.css';

const {TreeNode} = Tree;

/**
 * Shows the 'source' of the app as a Tree
 */
export default class Source extends Component {

  getFormattedTag (el) {
    const {tagName} = el;
    return `<${tagName}>`;
  }i

  /**
   * Binds to antd Tree onSelect. If an item is being unselected, path is undefined
   * otherwise 'path' refers to the element's path.
   */
  handleSelectElement (path) {
    const {selectElement, unselectElement} = this.props;

    if (!path) {
      unselectElement();
    } else {
      selectElement(path);
    }
  }

  render () {
    const {source, setExpandedPaths, expandedPaths, selectedPath, applyClientMethod} = this.props;

    // Recursives through the source and renders a TreeNode for an element
    let recursive = (elemObj) => {
      if (!elemObj) return null;

      return elemObj.children.map((el) => {
        return <TreeNode title={this.getFormattedTag(el)} key={el.path}>
          {recursive(el)}
        </TreeNode>;
      });
    };

    return <div className={InspectorStyles['tree-container']} style={{height: selectedPath ? 400 : 800}}>
      <Button icon='arrow-left' onClick={() => applyClientMethod({methodName: 'back'})}></Button>
      <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}></Button>
        <Tree   
          onExpand={setExpandedPaths} autoExpandParent={false} expandedKeys={expandedPaths}
          onSelect={(selectedPaths) => this.handleSelectElement(selectedPaths[0])} selectedKeys={[selectedPath]}>
          {recursive(source)}
        </Tree>
    </div>;
  }
}
