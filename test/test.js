require('mocha');
const onTimeOut = require("../index").onTimeOut;

describe('Common API testing...', () => {
  before(async () => {});
  after(async () => {});

  it('test', async () => {
    await onTimeOut()
  });
});
