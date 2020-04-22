import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getOptimalXPath, xmlToJSON } from '../../app/renderer/util';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import sinon from 'sinon';

const should = chai.should();
chai.use(chaiAsPromised);

// Helper that checks that the optimal xpath for a node is the one that we expect and also
// checks that the XPath successfully locates the node in it's doc
function testXPath (doc, node, expectedXPath, uniqueAttributes) {
  getOptimalXPath(doc, node, uniqueAttributes).should.equal(expectedXPath);
  xpath.select(expectedXPath, doc)[0].should.equal(node);
}

describe('util.js', function () {
  describe('#xmlToJSON', function () {
    it('should convert xml with unicode chars to json', function () {
      const json = xmlToJSON(`<hierarchy>
        <XCUIElementTypeApplication
          type="XCUIElementTypeApplication"
          name="🦋"
          label=""
          enabled="true"
          visible="true"
          x="0" y="0" width="768" height="1024">
            <XCUIElementTypeWindow
              type="XCUIElementTypeWindow"
              enabled="true"
              visible="false"
              x="0" y="0" width="1024" height="768">
            </XCUIElementTypeWindow>
        </XCUIElementTypeApplication>
      </hierarchy>`);
      json.should.eql({
        children: [{
          children: [],
          tagName: 'XCUIElementTypeWindow',
          attributes: {
            type: 'XCUIElementTypeWindow',
            enabled: 'true',
            visible: 'false',
            x: '0',
            y: '0',
            width: '1024',
            height: '768',
          },
          xpath: '//XCUIElementTypeApplication[@name="🦋"]/XCUIElementTypeWindow',
          path: '0',
        }],
        tagName: 'XCUIElementTypeApplication',
        attributes: {
          type: 'XCUIElementTypeApplication',
          name: '🦋',
          label: '',
          enabled: 'true',
          visible: 'true',
          x: '0',
          y: '0',
          width: '768',
          height: '1024',
        },
        xpath: '//XCUIElementTypeApplication[@name="🦋"]',
        path: '',
      });
    });
  });

  describe('#getOptimalXPath', function () {
    describe('on XML with height == 1', function () {
      it('should set an absolute xpath if attrName "id" is set', function () {
        const doc = new DOMParser().parseFromString(`<node id='foo'></node>`);
        testXPath(doc, doc.getElementById('foo'), '//node[@id="foo"]');
      });
      it('should set an absolute xpath if unique attributes is set to "content-desc" and that attr is set', function () {
        const doc = new DOMParser().parseFromString(`<node content-desc='foo'></node>`);
        testXPath(doc, doc.firstChild, '//node[@content-desc="foo"]', ['content-desc']);
      });
      it('should set an absolute xpath if unique attributes is set to "content-desc" and "something-else" and that "content-desc" is set', function () {
        const doc = new DOMParser().parseFromString(`<node content-desc='foo'></node>`);
        testXPath(doc, doc.firstChild, '//node[@content-desc="foo"]', ['something-else', 'content-desc']);
      });
      it('should set relative xpath with tagname if no unique attributes are set', function () {
        const doc = new DOMParser().parseFromString(`<node content-desc='foo'></node>`);
        testXPath(doc, doc.firstChild, '/node');
      });
    });
    describe('on XML with height == 2', function () {
      let doc;

      it('should set first child node to relative xpath with tagname if the child node has no siblings', function () {
        doc = new DOMParser().parseFromString(`<xml>
          <child-node content-desc='hello'>Hello</child-node>
        </xml>`);
        testXPath(doc, doc.getElementsByTagName('child-node')[0], '/xml/child-node', []);
      });

      it('should set first child node to relative xpath with tagname and index', function () {
        doc = new DOMParser().parseFromString(`<xml>
          <child-node content-desc='hello'>Hello</child-node>
          <child-node content-desc='world'>World</child-node>
        </xml>`);
        testXPath(doc, doc.getElementsByTagName('child-node')[0], '/xml/child-node[1]', []);
        testXPath(doc, doc.getElementsByTagName('child-node')[1], '/xml/child-node[2]', []);
      });
      it('should set first child node to absolute xpath if it has ID set', function () {
        doc = new DOMParser().parseFromString(`<xml>
          <child-node content-desc='hello'>Hello</child-node>
          <child-node content-desc='world'>World</child-node>
        </xml>`);
        testXPath(doc, doc.getElementsByTagName('child-node')[0], '//child-node[@content-desc="hello"]', ['content-desc']);
        testXPath(doc, doc.getElementsByTagName('child-node')[1], '//child-node[@content-desc="world"]', ['content-desc']);
      });
      it('should index children based on tagName', function () {
        doc = new DOMParser().parseFromString(`<xml>
          <child>Hello</child>
          <child-node>World</child-node>
          <child>Foo</child>
          <child-node>Bar</child-node>
        </xml>`);
        testXPath(doc, doc.getElementsByTagName('child')[0], '/xml/child[1]');
        testXPath(doc, doc.getElementsByTagName('child')[1], '/xml/child[2]');
        testXPath(doc, doc.getElementsByTagName('child-node')[0], '/xml/child-node[1]');
        testXPath(doc, doc.getElementsByTagName('child-node')[1], '/xml/child-node[2]');

        doc = new DOMParser().parseFromString(`<xml>
          <child>Hello</child>
          <child-node>World</child-node>
          <other-child-node>asdfasdf</other-child-node>
          <child-node>Bar</child-node>
        </xml>`);
        testXPath(doc, doc.getElementsByTagName('child')[0], '/xml/child');
        testXPath(doc, doc.getElementsByTagName('child-node')[0], '/xml/child-node[1]');
        testXPath(doc, doc.getElementsByTagName('child-node')[1], '/xml/child-node[2]');
        testXPath(doc, doc.getElementsByTagName('other-child-node')[0], '/xml/other-child-node');
      });
    });
    describe('on XML with height = 3', function () {
      let doc;
      it('should use child as absolute and relative grandchild path if child has an ID set', function () {
        doc = new DOMParser().parseFromString(`<root>
          <child id='foo'>
            <grandchild>Hello</grandchild>
            <grandchild>World</grandchild>
          </child>
        </root>`);
        testXPath(doc, doc.getElementsByTagName('grandchild')[0], '//child[@id="foo"]/grandchild[1]');
        testXPath(doc, doc.getElementsByTagName('grandchild')[1], '//child[@id="foo"]/grandchild[2]');
      });
      it('should use indexes of children and grandchildren if no IDs are set', function () {
        doc = new DOMParser().parseFromString(`<root>
          <child>
            <grandchild>Hello</grandchild>
            <grandchild>World</grandchild>
          </child>
          <irrelevant-child></irrelevant-child>
          <child>
            <grandchild>Foo</grandchild>
            <grandchild>Bar</grandchild>
          </child>
        </root>`);
        testXPath(doc, doc.getElementsByTagName('grandchild')[0], '/root/child[1]/grandchild[1]');
        testXPath(doc, doc.getElementsByTagName('grandchild')[1], '/root/child[1]/grandchild[2]');
        testXPath(doc, doc.getElementsByTagName('grandchild')[2], '/root/child[2]/grandchild[1]');
        testXPath(doc, doc.getElementsByTagName('grandchild')[3], '/root/child[2]/grandchild[2]');
      });
      it('should use indices if the unique attribute isn\'t actually unique', function () {
        doc = new DOMParser().parseFromString(`<root>
          <child id='foo'>
            <grandchild>Foo</grandchild>
            <grandchild>Bar</grandchild>
          </child>
          <child id='foo'>
            <grandchild>Hello</grandchild>
          </child>
          <child id='foo'></child>
          <another-child>Irrelevant</another-child>
          <another-child>Irrelevant</another-child>
          <child id='foo'>
            <grandchild></grandchild>
            <child id='foo'>
              <great-grand-child></great-grand-child>
            </child>
          </child>
        </root>`);
        const grandchildren = doc.getElementsByTagName('grandchild');
        testXPath(doc, grandchildren[0], '(//child[@id="foo"])[1]/grandchild[1]');
        testXPath(doc, grandchildren[1], '(//child[@id="foo"])[1]/grandchild[2]');
        testXPath(doc, grandchildren[2], '(//child[@id="foo"])[2]/grandchild');
        testXPath(doc, grandchildren[3], '(//child[@id="foo"])[4]/grandchild');

        const greatgrandchildren = doc.getElementsByTagName('great-grand-child');
        testXPath(doc, greatgrandchildren[0], '(//child[@id="foo"])[5]/great-grand-child');

        const children = doc.getElementsByTagName('child');
        testXPath(doc, children[0], '(//child[@id="foo"])[1]');
        testXPath(doc, children[1], '(//child[@id="foo"])[2]');
        testXPath(doc, children[2], '(//child[@id="foo"])[3]');
        testXPath(doc, children[3], '(//child[@id="foo"])[4]');
        testXPath(doc, children[4], '(//child[@id="foo"])[5]');
      });
    });

    describe('when exceptions are thrown', function () {
      it('should keep going if xpath.select throws an exception', function () {
        const xpathSelectStub = sinon.stub(xpath, 'select').callsFake(() => { throw new Error('Exception'); });
        const doc = new DOMParser().parseFromString(`<node id='foo'>
          <child id='a'></child>
          <child id='b'>
            <grandchild id='hello'></grandchild>
          </child>
        </node>`);
        getOptimalXPath(doc, doc.getElementById('hello')).should.equal('/node/child[2]/grandchild');
        xpathSelectStub.restore();
      });

      it('should return undefined if anything else throws an exception', function () {
        const doc = new DOMParser().parseFromString(`<node id='foo'>
          <child id='a'></child>
          <child id='b'>
            <grandchild id='hello'></grandchild>
          </child>
        </node>`);
        const node = doc.getElementById('hello');
        node.getAttribute = () => { throw new Error('Some unexpected error'); };
        should.not.exist(getOptimalXPath(doc, node));
      });
    });
  });
});