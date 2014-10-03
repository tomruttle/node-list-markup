'use strict';

var listMarkup = require('../add-markup');
var should = require('should');

describe('Add markup function', function () {

  it('only converts the correct list types', function (done) {

    listMarkup.addMarkup('<p>- a</p>').should.eql('<ul><li>a</li></ul>');
    listMarkup.addMarkup('<p>• a</p>').should.eql('<ul><li>a</li></ul>');

    listMarkup.addMarkup('<p>(1) a</p>').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('<p>1) a</p>').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('<p>( 1 ) a</p>').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('<p>1 ) a</p>').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('<p>1. a</p>').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('<p>1 . a</p>').should.eql('<ol><li>a</li></ol>');

    listMarkup.addMarkup('<p>1. a').should.eql('<p>1. a');
    listMarkup.addMarkup('1. a</p>').should.eql('1. a</p>');

    listMarkup.addMarkup('<p>[1] a</p>').should.eql('<p>[1] a</p>');
    listMarkup.addMarkup('<p>1)a</p>').should.eql('<p>1)a</p>');
    listMarkup.addMarkup('<p>1a</p>').should.eql('<p>1a</p>');
    listMarkup.addMarkup('<p>1 a</p>').should.eql('<p>1 a</p>');
    listMarkup.addMarkup('<p>-a</p>').should.eql('<p>-a</p>');
    listMarkup.addMarkup('<p>•a</p>').should.eql('<p>•a</p>');
    listMarkup.addMarkup('<p>a</p>').should.eql('<p>a</p>');

    done();

  });

  it('accepts different blocks', function (done) {

    listMarkup.addMarkup('<br />1. a<br />').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('<br />1. a\n').should.eql('<ol><li>a</li></ol>');
    listMarkup.addMarkup('</p><p>1. a\n').should.eql('</p><ol><li>a</li></ol>');
    listMarkup.addMarkup('</p>1. a\n').should.eql('</p><ol><li>a</li></ol>');

    done();
  });

  it('can handle multiple items in a list', function (done) {

    listMarkup.addMarkup('<p>1. a</p><p>2. b</p>').should.eql('<ol><li>a</li><li>b</li></ol>');
    listMarkup.addMarkup('<p>1. a<br />2. b</p>').should.eql('<ol><li>a</li><li>b</li></ol>');
    listMarkup.addMarkup('<p>1. a<br />2. b<br />3. c</p>').should.eql('<ol><li>a</li><li>b</li><li>c</li></ol>');

    listMarkup.addMarkup('<p>1. a 2 b</p>').should.eql('<ol><li>a 2 b</li></ol>');
    listMarkup.addMarkup('<p>1. a 2. b</p>').should.eql('<ol><li>a 2. b</li></ol>');

    listMarkup.addMarkup('<p>1. a\n2 b</p>').should.eql('<ol><li>a</li></ol><p>2 b</p>');
    listMarkup.addMarkup('<p>1. a<br />2 b</p>').should.eql('<ol><li>a</li></ol><p>2 b</p>');

    done();

  });

  it ('cleans up around itself', function (done) {

    listMarkup.addMarkup('<p>1. a<br />2. b</p><h1></h1>').should.eql('<ol><li>a</li><li>b</li></ol>');
    listMarkup.addMarkup('<p><p>1. a<br />2. b</p>').should.eql('<ol><li>a</li><li>b</li></ol>');
    listMarkup.addMarkup('<p></p><p>1. a<br />2. b</p>').should.eql('<ol><li>a</li><li>b</li></ol>');

    done();

  });

  it ('also closes block tags properly around text', function (done) {

    listMarkup.addMarkup('<p>This is some text:<br />1. a<br />2. b</p>').should.eql('<p>This is some text:</p><ol><li>a</li><li>b</li></ol>');
    listMarkup.addMarkup('<p>This is some text:</p>1. a<br />2. b</p>').should.eql('<p>This is some text:</p><ol><li>a</li><li>b</li></ol>');

    listMarkup.addMarkup('<p>This is some text:<br />1. a<br />2. b<br />3. c</p>')
      .should.eql('<p>This is some text:</p><ol><li>a</li><li>b</li><li>c</li></ol>');

    listMarkup.addMarkup('<p>This is some text:<br />1. a<br />2. b<br />3. c</p><p>This is some more text.</p>')
      .should.eql('<p>This is some text:</p><ol><li>a</li><li>b</li><li>c</li></ol><p>This is some more text.</p>');

    done();

  });

});
