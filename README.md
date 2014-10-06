node-list-markup
================

Parses text and adds HTML markup around what it thinks are lists.

Highly opinionated. At time of writing accepts the following styles of list:
 1. item
 1) item
 1 . item
 (1) item
 ( 1 ) item
 1) item
 1 ) item
 - item
 • item

Will convert the numbers into <ol> and glyphs into <ul>.

##Usage

listMarkup = require('list-markup');

var simpleString = 'String to be converted into list.';
var listyString = listMarkup.addMarkup(simpleString);

