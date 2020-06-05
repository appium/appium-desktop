import XPath from 'xpath';
import { withTranslation as wt } from 'react-i18next';
import config from '../configs/app.config';
import _ from 'lodash';
import { DOMParser } from 'xmldom';

// Attributes on nodes that we know are unique to the node
const UNIQUE_ATTRIBUTES = [
  'name',
  'content-desc',
  'id',
  'accessibility-id',
];

/**
 * Translates sourceXML to JSON
 *
 * @param {string} source
 * @returns {Object}
 */
export function xmlToJSON (source) {
  const childNodesOf = (xmlNode) => {
    if (!xmlNode || !xmlNode.hasChildNodes()) {
      return [];
    }

    const result = [];
    for (let childIdx = 0; childIdx < xmlNode.childNodes.length; ++childIdx) {
      const childNode = xmlNode.childNodes.item(childIdx);
      if (childNode.nodeType === 1) {
        result.push(childNode);
      }
    }
    return result;
  };

  const translateRecursively = (xmlNode, parentPath = '', index = null) => {
    const attributes = {};
    for (let attrIdx = 0; attrIdx < xmlNode.attributes.length; ++attrIdx) {
      const attr = xmlNode.attributes.item(attrIdx);
      attributes[attr.name] = attr.value;
    }

    // Dot Separated path of indices
    const path = _.isNil(index) ? '' : `${!parentPath ? '' : parentPath + '.'}${index}`;
    return {
      children: childNodesOf(xmlNode)
        .map((childNode, childIndex) => translateRecursively(childNode, path, childIndex)),
      tagName: xmlNode.tagName,
      attributes,
      xpath: getOptimalXPath(xmlDoc, xmlNode, UNIQUE_ATTRIBUTES),
      path,
    };
  };
  const xmlDoc = new DOMParser().parseFromString(source);
  const firstChild = childNodesOf(xmlDoc.documentElement)[0];
  return firstChild ? translateRecursively(firstChild) : {};
}

/**
 * Get an optimal XPath for a DOMNode
 *
 * @param {DOMDocument} doc
 * @param {DOMNode} domNode
 * @param {Array<String>} uniqueAttributes Attributes we know are unique (defaults to just 'id')
 * @returns {string}
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
