import XPath from 'xpath';
import { withTranslation as wt } from 'react-i18next';
import config from '../configs/app.config';
import _ from 'lodash';

/**
 * Get an optimal XPath for a DOMNode
 * @param {*} domNode {DOMNode}
 * @param {*} uniqueAttributes {array[string]} Attributes we know are unique (defaults to just 'id')
 */
export function getOptimalXPath (doc, domNode, uniqueAttributes = ['id']) {
  try {
    // BASE CASE #1: If this isn't an element, we're above the root, return empty string
    if (!domNode.tagName || domNode.nodeType !== 1) {
      return '';
    }

    // BASE CASE #2: If this node has a unique attribute, return an absolute XPath with that attribute
    for (let attrName of uniqueAttributes) {
      const attrValue = domNode.getAttribute(attrName);
      if (attrValue) {
        let xpath = `//${domNode.tagName || '*'}[@${attrName}="${attrValue}"]`;
        let othersWithAttr;

        // If the XPath does not parse, move to the next unique attribute
        try {
          othersWithAttr = XPath.select(xpath, doc);
        } catch (ign) {
          continue;
        }

        // If the attribute isn't actually unique, get it's index too
        if (othersWithAttr.length > 1) {
          let index = othersWithAttr.indexOf(domNode);
          xpath = `(${xpath})[${index + 1}]`;
        }
        return xpath;
      }
    }


    // Get the relative xpath of this node using tagName
    let xpath = `/${domNode.tagName}`;

    // If this node has siblings of the same tagName, get the index of this node
    if (domNode.parentNode) {
      // Get the siblings
      const childNodes = Array.prototype.slice.call(domNode.parentNode.childNodes, 0).filter((childNode) => (
        childNode.nodeType === 1 && childNode.tagName === domNode.tagName
      ));

      // If there's more than one sibling, append the index
      if (childNodes.length > 1) {
        let index = childNodes.indexOf(domNode);
        xpath += `[${index + 1}]`;
      }
    }

    // Make a recursive call to this nodes parents and prepend it to this xpath
    return getOptimalXPath(doc, domNode.parentNode, uniqueAttributes) + xpath;
  } catch (ign) {
    // If there's an unexpected exception, abort and don't get an XPath
    return null;
  }
}

export function withTranslation (componentCls, ...hocs) {
  return _.flow(
    ...hocs,
    wt(config.namespace),
  )(componentCls);
}
