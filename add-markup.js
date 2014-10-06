'use strict';

var addMarkup = function (text) {

  // Blocks that indicate a new line has been started
  var blocks = 'p|h[1-6]';
  var blocksClose = '\\/p|\\/h[1-6]';

  // Glyphs that we expect to start a new list
  var glyphs = '-\u2022';

  /*
   * Match all lists, numbered or otherwise.
   */
  var match = new RegExp(

    // Must start with a newline or block character
    '(?:<(' + blocks + '|' + blocksClose + '|br \\/)>|\\n)\\s*' +

    // Matches: "- ", "• ", "(1) ", "1) ", "( 1 ) ", "1 ) ", "1. ", "1 . "
    '([' + glyphs + ']|\\(?\\s*\\d+\\s*[\\.\\)])\\s+' +

    // Followed by the contents of the list item
    '([\\s\\S]+?)' +

    // Must be terminated by a newline or end-block character
    '\\s*(?=<(' + blocks + '|' + blocksClose + '|br \\/)>|\\n)',

    // Match everywhere
    'g'

  );

  // Find likely list itels and create a separate list for each one
  if (match.test(text)) {
    text = text.replace(match, function (match, tag, marker, content) {

      // If the marker character is a digit followed by a . or a ),
      // it should be an <ol>, otherwise, it's a <ul>
      var listType = (/^\(?\s*\d+\s*[\.\)]$/.test(marker)) ? 'ol' : 'ul';

      return '<' + tag + '>' + '<' + listType + '><li>' + content + '</li></' + listType + '>';

    });

    // Lists should never be within blocks, so remove the end block
    match = new RegExp('<\\/(ul|ol)>(?:<(' + blocksClose + '|br \\/)>|\\s)*', 'g');
    text = text.replace(match, '</$1>');

    // ... and remove the leading block
    match = new RegExp('(?:<(?:' + blocks + '|br \\/)>|\\s)*(?=<ul>|<ol>)', 'g');
    text = text.replace(match, '');

    // Closed lists should always be followed by a new opening block.
    match = new RegExp('<\\/(ul|ol)>\\s*(?=[^<$]\\S)', 'g');
    text = text.replace(match, '</$1><p>');

    // If we have left an open block, close it.
    match = new RegExp('<(' + blocks + ')>((?:[^<]|<br \\/>)*?)(?!<\\/\\1>)*<(ul|ol)>', 'g');
    text = text.replace(match, '<$1>$2</$1><$3>');

    // If we have a leftover close p block, open it.
    match = new RegExp('<\\/(ul|ol)>([^<]+?)<(ul|ol|\\/ul|\\/ol|' + blocks + '|' + blocksClose + ')>', 'g');
    text = text.replace(match, '</$1><p>$2</p><$3>');

    // If we have inadvertantly created an empty block before the list, delete it.
    match = new RegExp('<(' + blocks + ')>(?:<br \\/>|\\s)*<\\/\\1>(?:<br \\/>|\\s)*<(ul|ol)>', 'g');
    text = text.replace(match, '<$2>');

    // If we have inadvertantly created a double close block before the list, delete it.
    match = new RegExp('<\\/(' + blocks + ')>(?:<br \/>|\\s)*<\\/\\1>(?:<br \\/>|\\s)*<(ul|ol)>', 'g');
    text = text.replace(match, '</$1><$2>');

    // ...and delete it afterwards as well.
    match = new RegExp('<\\/(' + blocks + ')>(?:<br \\/>|\\s)*?<\\/\\1>', 'g');
    text = text.replace(match, '<\/$1>');

    // If two lists are the same type and adjacent, merge them into one list
    match = new RegExp('<\\/(ul|ol)>(<(' + blocks + '|' + blocksClose + '|br \\/)>)*\\s*<\\1>', 'g');
    text = text.replace(match, '');

  }

  return text;

};

if(typeof require === 'function'){
  exports.addMarkup = addMarkup;
}
