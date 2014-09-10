var connect = require('..');
var Remote  = require('../lib/remote');
var expect  = require('chai').expect;
var server  = require('../demo/message/server');
var remote;

describe('remote', function(){
  it('should work as a function', function() {
    expect(connect(server())).to.be.an.instanceof(Remote);
  })

  beforeEach(function(){
    remote = connect(server());
  });

  describe('#get(key)', function(){
    it('should return Remote for key', function(){
      expect(remote.get('object')).to.be.an.instanceof(Remote);
    });
    it('should be a thenable', function() {
      expect(remote.get('object').then).to.be.an.instanceof(Function);
    });
    it('should resolve the value', function() {
      return remote.get('object').get('value').then(function(value) {
        expect(value).to.equal('value');
      });
    });
  });
  describe('#put(key, value)', function(){
    it('should return Remote for key', function(){
      expect(remote.put('test', true)).to.be.an.instanceof(Remote);
    });
    it('should be a thenable', function() {
      expect(remote.put('test', true).then).to.be.an.instanceof(Function);
    });
    it('should resolve the value', function() {
      return remote.put('test', true).then(function(value) {
        expect(value).to.equal(true);
      })
    });
  });
  describe('#post(key, arguments)', function(){
    it('should return Remote for key', function(){
      expect(remote.get('object').post('method',['hello'])).to.be.an.instanceof(Remote);
    });
    it('should be a thenable', function() {
      expect(remote.get('object').post('method',['hello']).then).to.be.an.instanceof(Function);
    });
    it('should resolve the value', function() {
      return remote.get('object').post('method',['hello']).then(function(value) {
        expect(value).to.equal('confirm: hello');
      })
    });
  });
  describe('#delete(key)', function(){
    it('should return Remote for key', function(){
      expect(remote.delete('object')).to.be.an.instanceof(Remote);
    });
    it('should be a thenable', function() {
      expect(remote.delete('object').then).to.be.an.instanceof(Function);
    });
    it('should resolve the value', function() {
      return remote.delete('object').then(function(value) {
        expect(value).to.equal(true);
      })
    });
  });
});