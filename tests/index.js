/*jshint expr:true*/
'use strict';

let EventEmitter = require('../');
let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let sinonChai = require('sinon-chai');
chai.use(sinonChai);

class Listener extends EventEmitter {}
class Publisher extends EventEmitter {}

describe('ES6 EventEmitter Object', function () {
  let li, pr;

  before(function() {
    li = new Listener();
    pr = new Publisher();
  });

  it('should call the correct listener', function () {
    let spy = sinon.spy();
    let spy2 = sinon.spy();

    li.listenTo(pr, 'event1', spy);
    li.listenTo(pr, 'event2', spy2);
    pr.trigger('event1');

    expect(spy).to.have.been.calledOnce;
    pr.trigger('event1');
    pr.trigger('event1');
    pr.trigger('event1');
    pr.trigger('event1');
    expect(spy).to.have.callCount(5);
    expect(spy2).to.not.have.been.called;
  });

  it('should forward arguments to the listener', function () {
    let spy = sinon.spy();
    li.listenTo(pr, 'change', spy);
    pr.trigger('change', 'abc', 123);

    expect(spy).to.have.been.calledOnce;
    expect(spy).to.have.been.calledWith('abc', 123);
  });

  it('should listenToOnce only once...', function () {
    let spy = sinon.spy();

    li.listenToOnce(pr, 'event1', spy);
    pr.trigger('event1');
    pr.trigger('event1');
    pr.trigger('event1');
    pr.trigger('event1');
    pr.trigger('event1');

    expect(spy).to.have.been.calledOnce;
  });

  it('should stopListening to all events', function () {

  });

  it('should stopListening to one specific object', function () {

  });

  it('should stopListening to one specific event on an object', function () {

  });

  it('should stopListening only on one listener', function () {

  });
});