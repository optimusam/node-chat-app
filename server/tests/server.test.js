let expect = require('chai').expect;
let genMessage = require('../utils/message');

describe('genMessage', () => {
    it('should return an object containing message data', () => {
        let res = genMessage('sameer', 'hello');
        expect(res).to.have.property('from', 'sameer');
        expect(res).to.have.property('text', 'hello');
        expect(res).to.have.property('createdAt').that.is.a('number');
    });
});