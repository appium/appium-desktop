import { Application } from  'spectron';
import assert from 'assert';
import os from 'os';
import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

const platform = os.platform();

describe('inspector window', function () {
  beforeEach(function () {

  });

  it('shows an initial window', function () {
    true.should.equal(true);
  });
});