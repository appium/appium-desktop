import { getLocators } from '../../app/renderer/components/Inspector/shared';

describe('inspector', function () {
  describe('.getLocators', function () {
    it('should find ID', function () {
      getLocators({'resource-id': 'Resource ID'}).id.should.equal('Resource ID');
      getLocators({'id': 'ID'}).id.should.equal('ID');
      getLocators({'id': 'ID', 'resource-id': 'Resource ID'}).id.should.equal('Resource ID');
    });
    it('should find accessibility id', function () {
      getLocators({'content-desc': 'Content Desc'})['accessibility id'].should.equal('Content Desc');
      getLocators({'name': 'Name'})['accessibility id'].should.equal('Name');
      getLocators({'content-desc': 'Content Desc', 'name': 'Name'})['accessibility id'].should.equal('Content Desc');
    });
  });
});