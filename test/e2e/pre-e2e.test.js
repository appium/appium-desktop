import { Application } from 'spectron';
import { fs, logger } from 'appium-support';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { e2eBefore, e2eAfter } from '../../../shared/test-helpers';

const log = logger.getLogger('E2E Test');

chai.should();
chai.use(chaiAsPromised);

before(e2eBefore({appName: 'server', log, Application, fs}));
after(e2eAfter);
