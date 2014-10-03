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

    listMarkup.addMarkup('<p>This is some text:<br />\n(1) a</p>\n<p>(2) b</p>\n<p>(3) c</p>\n<p>(4) d</p>\n<p>(5) e<br />\nThis is some more text.</p>')
      .should.eql('<p>This is some text:</p><ol><li>a</li><li>b</li><li>c</li><li>d</li><li>e</li></ol><p>This is some more text.</p>');

    done();

  });

  it ('works with multiple lines in a list-item', function (done) {

    listMarkup.addMarkup('<p>This is some text:</p>\n<p>- a<br />\nb.(1) c.(2,3) d (4,5), e</p>\n<p>- f<br />\ng</p>')
      .should.eql('<p>This is some text:</p><ul><li>a</li></ul><p>b.(1) c.(2,3) d (4,5), e</p><ul><li>f</li></ul><p>g</p>');

    listMarkup.addMarkup('<p>ba:</p>\n<p>• baa<br />\nbaaa</p>\n<p>• bab<br />\nbaba<br />\n- babaa<br />\n- babab<br />\n- babac</p>\n<p>B. b</p>')
      .should.eql('<p>ba:</p><ul><li>baa</li></ul><p>baaa</p><ul><li>bab</li></ul><p>baba</p><ul><li>babaa</li><li>babab</li><li>babac</li></ul><p>B. b</p>');

    listMarkup.addMarkup('<h2>heading</h2>\n<p>A. a</p>\n<p>a) 1</p>\n<p>aa</p>\n<p>ab<br />\naba:<br />\ni) abaa<br />\nii) abab<br />\n\niii) abac</p>\n<p>ac</p>\n<p>b) g</p>\n<p>ba:</p>\n<p>• baa<br />\nbaaa</p>\n<p>• bab<br />\nbaba<br />\n- babaa<br />\n- babab<br />\n- babac</p>\n<p>B. b</p>\n<p>ba</p>\n<p>C. c</p>\n<p>ca</p>')
      .should.eql('<h2>heading</h2>\n<p>A. a</p>\n<p>a) 1</p>\n<p>aa</p>\n<p>ab<br />\naba:<br />\ni) abaa<br />\nii) abab<br />\niii) abac</p>\n<p>ac</p>\n<p>b) g</p>\n<p>ba:</p><ul><li>baa</li></ul><p>baaa</p><ul><li>bab</li></ul><p>baba</p><ul><li>babaa</li><li>babab</li><li>babac</li></ul><p>B. b</p>\n<p>ba</p>\n<p>C. c</p>\n<p>ca</p>');

    done();

  });

});
