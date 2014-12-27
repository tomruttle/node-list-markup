node-list-markup
================

Parses text and adds HTML markup around what it thinks are lists.

Highly opinionated. At time of writing accepts the following styles of list:

<pre>
 1. item
 1) item
 1 . item
 (1) item
 ( 1 ) item
 1) item
 1 ) item
 - item
 • item
</pre>

Will convert the numbers into ordered-lists and glyphs into unordered-lists

##Usage

<pre>
listMarkup = require('list-markup');

var simpleString = 'String to be converted into list.';
var listyString = listMarkup.addMarkup(simpleString);
</pre>
