import React, { Component } from 'react';
import { Tree } from 'antd';

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
  }

  render () {
    const { source } = this.props;

    if (!source) return <div>Loading</div>;

    let sourceXML = (new DOMParser()).parseFromString(source, 'text/xml');

    let recursive = (elem, parentLocatorArr=[]) => {
      if (!elem) return null;

      return [...elem.children].map((el, i) => {
        let locatorArr = [...parentLocatorArr, i];
        return <TreeNode title={this.getFormattedTag(el)} key={locatorArr}>
          {recursive(el, locatorArr)}
        </TreeNode>;
      });
    };

    return <Tree>
      {recursive(sourceXML)}
    </Tree>;
  }
}
