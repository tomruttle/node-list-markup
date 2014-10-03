'use strict';

var listMarkup = require('../add-markup');
var should = require('should');

describe('Add markup function', function () {

// Test<br />- a<br />1a<br />• a<br />(1) a<br />1) a<br />( 1 ) a<br />[1] a<br />1 ) a<br />-a<br />1. a<br />1)a<br />1 . a<br />1 a<br />End Test
  it('only converts the correct list types', function (done) {

    var test;

    test = '<br />- a';
    listMarkup.addMarkup(test).should.eql('<ul><li>a</li><ul>');

    done();

  });

});
