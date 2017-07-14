import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getLocators, isUnique } from '../../app/renderer/components/Inspector/shared';

const should = chai.should();
chai.use(chaiAsPromised);

describe('inspector', function () {
  describe('.getLocators', function () {
    it('should find ID', function () {
      getLocators({'resource-id': 'Resource ID'}).id.should.equal('Resource ID');
      getLocators({'id': 'ID'}).id.should.equal('ID');
      getLocators({'id': 'ID', 'resource-id': 'Resource ID'}).id.should.equal('Resource ID');
    });
    it('should not find ID if ID is not unique', function () {
      should.not.exist(getLocators({id: 'ID'}, `<root>
        <node id='ID'></node>
        <node id='ID'></node>
      </root>`).id);
    });
    it('should find accessibility id', function () {
      getLocators({'content-desc': 'Content Desc'})['accessibility id'].should.equal('Content Desc');
      getLocators({'name': 'Name'})['accessibility id'].should.equal('Name');
      getLocators({'name': 'Name'}, `<root>
        <node content-desc='Name'></node>
      </root>`)['accessibility id'].should.equal('Name');
      getLocators({'content-desc': 'Content Desc', 'name': 'Name'})['accessibility id'].should.equal('Content Desc');
    });
    it('should not find accessibility ID if accessibility ID is not unique', function () {
      should.not.exist(getLocators({'content-desc': 'CD'}, `<root>
        <node content-desc='ID'></node>
        <node content-desc='ID'></node>
      </root>`).id);
    });
  });
  describe('.isUnique', function () {
    it('should return false if two nodes have the same attribute value', function () {
      isUnique('id', 'ID', `<root>
        <node id='ID'></node>
        <node id='ID'></node>
      </root>`).should.be.false;
    });
    it('should return false if two nodes have the same attribute value', function () {
      isUnique('id', 'ID', `<root>
        <node id='ID'></node>
      </root>`).should.be.true;
      isUnique('id', 'ID', `<root>
        <node></node>
        <node></node>
      </root>`).should.be.true;
    });
    it('should return true if no sourceXML was provided', function () {
      isUnique('hello', 'world').should.be.true;
    });
  });
});