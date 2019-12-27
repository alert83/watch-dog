require('mocha');
const onTimeOut = require("../index").onTimeOut;

describe('Testing...', () => {
  it('test', async () => {
    await onTimeOut();
  });
});
