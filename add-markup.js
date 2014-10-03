'use strict';

var addMarkup = function (text) {

  // Blocks that indicate a new line has been started
  var blocks = '<\\/ul>|<\\/ol>|<\\/?p>|<\\/h[1-6]>|<hr>';
  var blocksClose = '<\\/ul>|<\\/ol>|<\\/p>|<\\/h[1-6]>';

  /*
   * Match all lists, numbered or otherwise.
   */
  var match = new RegExp('(?:' +

    // Must start with a newline or end-block character
    '(?=' + blocks + '|<br \\/>)|\\n)' +

    // Can optionally have an opening <p> tag or whitespace before it
    '(?:<p>)?\\s*' +

    // Matches: "- ", "• ", "(1) ", "1) ", "( 1 ) ", "1 ) ", "1. ", "1 . "
    '([-\u2022]|\\(?\\s*\\d+\\s*[\\.\\)])\\s+' +

    // Followed by an amount of stuff
    '(.+?)' +

    // Must be terminated by a newline or end-block character
    '(?=\\n|' + blocksClose + '|<br \\/>)',

    // Match everywhere
    'g'

  );
console.log(match);
  // Step 1. Find likely list itels and create a separate list for each one
  if (match.test(text)) {
    text = text.replace(match, function (match, marker, content) {

      // If the marker character is a digit followed by a . or a ),
      // it should be an <ol>, otherwise, it's a <ul>
      var listType = (/^\(?\s*\d+\s*[\.\)]$/.test(marker)) ? 'ol' : 'ul';

      return '<' + listType + '><li>' + content + '</li></' + listType + '>';

    });

    // Step 2. If two lists are adjacent, merge them into one list
    match = new RegExp('<\\/ul>(' + blocksClose + '|<br \\/>|\\s)*<ul>', 'g');
    text = text.replace(match, '');

    match = new RegExp('<\\/ol>(' + blocksClose + '|<br \\/>|\\s)*<ol>', 'g');
    text = text.replace(match, '');

    // Step 3. Lists should never be within blocks, so remove
    match = new RegExp('<\\/ul>\\s*(' + blocksClose + ')', 'g');
    text = text.replace(match, '</ul>');

    match = new RegExp('<\\/ol>\\s*(' + blocksClose + ')', 'g');
    text = text.replace(match, '</ol>');

    text = text.replace(/(<p>.*)(?:<br \/>)\s*(?=<ul>|<ol>)/g, '$1</p>\n');

  }

  return text;

};

if(typeof require === 'function'){
  exports.addMarkup = addMarkup;
}
