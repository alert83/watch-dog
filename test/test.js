require('mocha');
const onTimeOut = require("../index").onTimeOut;

describe('Testing...', () => {
  it('test', (done) => {
    onTimeOut()
      .then(() => done())
      .catch((err) => done(err))
  });
});
