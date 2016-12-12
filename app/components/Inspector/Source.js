import React, { Component } from 'react';
import { Tree, Spin } from 'antd';

const { TreeNode } = Tree;

export default class Source extends Component {

  isIgnoredAttr (attrMap) {
    let name = attrMap.name;
    return name === 'class' || name === 'text' || name === 'package';
  }

  getFormattedTag (el) {
    let attributes = el.attributes ? [...el.attributes] : [];

    let attrString = attributes.reduce((base, attrMap) =>
        (this.isIgnoredAttr(attrMap)) ? '' : base + ` ${attrMap.name}="${attrMap.value}"`, ''
    );
    return `<${el.tagName}${attrString}>`;
  }i

  getXPath (el, parentXPath = '', index = 0) {
    return `${parentXPath}/*[${index + 1}]`;
  }

  handleSelectElement (xpath) {
    const { source, selectElement, unselectElement } = this.props;

    if (!xpath) {
      return unselectElement();
    }

    // Using xpath determine what XML node was selected
    let sourceXML = (new DOMParser()).parseFromString(source, 'text/xml');
    let selectedNode = document.evaluate('//*/*', sourceXML, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // Translate the attributes NamedNodeMap to an object
    let { attributes, tagName } = selectedNode;
    let attrObject = {};
    [...attributes].forEach((attribute) => attrObject[attribute.name] = attribute.value);

    // Dispatch the selectElement event
    selectElement(tagName, attrObject, xpath);
  }

  render () {
    const { source, selectedNode, setExpandedXPaths, expandedXPaths } = this.props;
    const { xpath } = selectedNode || {};

    let selectedXPath = [xpath];

    if (!source) return <div>Loading</div>;

    let sourceXML = (new DOMParser()).parseFromString(source, 'text/xml');

    let recursive = (elem, parentXPath = '') => {
      if (!elem) return null;

      return [...elem.children].map((el, index) => {
        let xpath = this.getXPath(el, parentXPath, index);

        return <TreeNode title={this.getFormattedTag(el)} key={xpath}>
          {recursive(el, xpath)}
        </TreeNode>;
      });
    };

    return <Tree 
      onExpand={setExpandedXPaths} autoExpandParent={false} expandedKeys={expandedXPaths}
      onSelect={(selectedXPaths) => this.handleSelectElement(selectedXPaths[0])} selectedKeys={selectedXPath}>
      {recursive(sourceXML)}
    </Tree>;
  }
}
