/*import React, { Component } from 'react';

class HighlightedParagraph {

}

class Tag extends Component {

  handleToggleExpand () {

  }

  render () {
    const props = this.props;
    let style = {};
    if (!this.props.isVisible) {
      style.display = 'none';
    }

    let indents = [];
    let indentation = this.props.indentation || 0;
    while (indentation-- > 0) {
      indents.push(['&nbsp;']);
    }

    return <span>
        { indents }
        <HighlightedParagraph {...props} style={style}>
        {
            this.props.childNodes.map((childTag) => {
              var childProps = {
                ...props,
                ...childTag,
                indentation: (this.props.indentation || 0) + 1
              };
              return <Tag {...childProps} isVisible={this.state.expanded} />;
            })
        }
        { !this.props.isVisible && <p>...</p> }
        </HighlightedParagraph>
    </span>;
  }

}

export default class Inspector extends Component {

  render () {
      let props = this.props;
      let root = this.props.root;
      let tagProps = {
          ...props,
          ...root,
      };
      return <Tag {...tagProps} />;
  }
  
}*/