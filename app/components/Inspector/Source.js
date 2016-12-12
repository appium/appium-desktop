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

  render () {
    const { source, selectElementByXPath, selectedXPath, setExpandedXPaths, expandedXPaths } = this.props;

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

    return <Tree onSelect={(args) => selectElementByXPath(args[0])}  
      onExpand={setExpandedXPaths} autoExpandParent={false} expandedKeys={expandedXPaths}
      onSelect={(selectedXPaths) => selectElementByXPath(selectedXPaths[0])} selectedKeys={[selectedXPath]}>
      {recursive(sourceXML)}
    </Tree>;
  }
}
