
var colors = require('colors');

export function printHighlightedSpec(markedDoc) {
    var spec = '';
    for(var i in markedDoc) {
        if (markedDoc.hasOwnProperty(i)) {
            var part = markedDoc[i];
            if(part.highlight === true)
                spec = spec + part.text.covered;
            else if (part.highlight)
                spec = spec + part.text[part.highlight];
            else
                spec = spec + part.text;
        }
    }
    console.log(spec);
}

printHighlightedSpec.setTheme = function (colorTheme) {
    colors.setTheme(colorTheme);
};
