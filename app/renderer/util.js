import XPath from 'xpath';

/**
 * Get an optimal XPath for a DOMNode
 * @param {*} domNode {DOMNode} 
 * @param {*} uniqueAttributes {array[string]} Attributes we know are unique (defaults to just 'id')
 */
export function getOptimalXPath (doc, domNode, uniqueAttributes = ['id']) {
  // BASE CASE #1: If this isn't an element, we're above the root, return empty string
  if (!domNode.tagName) {
    return '';
  }

  // BASE CASE #2: If this node has a unique attribute, return an absolute XPath with that attribute
  for (let attrName of uniqueAttributes) {
    const attrValue = domNode.getAttribute(attrName);
    if (attrValue) {
      let xpath = `//${domNode.tagName}[@${attrName}="${attrValue}"]`;
      const othersWithAttr = XPath.select(xpath, doc);

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
    const childNodes = [...domNode.parentNode.childNodes].filter((childNode) => (
      childNode.nodeType === 1 && childNode.tagName === domNode.tagName
    )); 
    
    // If there's more than one sibling, append the index
    if (childNodes.length > 1) {
      let index = childNodes.indexOf(domNode);
      xpath +=  `[${index + 1}]`;
    }
  }

  // Make a recursive call to this nodes parents and prepend it to this xpath
  return getOptimalXPath(doc, domNode.parentNode, uniqueAttributes) + xpath;
}