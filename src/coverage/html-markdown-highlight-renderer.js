var markdown = require( "marked" );

var theme;

// markedDoc is an ordered list of parts of the markdown document, each element has text and highlight (string / boolean)
export function printHighlightedSpec(markedDoc) {
    console.log(highlightedSpec(markedDoc));
}

export function highlightedSpec(markedDoc) {
    var spec = '';
    for(var i in markedDoc) {
        if (markedDoc.hasOwnProperty(i)) {
            var part = markedDoc[i];
            var partHtml = markdown(part.text);
            if(part.highlight === true)
                spec = spec + `<span class="covered">${partHtml}</span>`;
            else if (part.highlight)
                spec = spec + `<span class="${part.highlight}">${partHtml}</span>`;
            else
                spec = spec + partHtml;
        }
    }
    return themeCss() + '\n' + spec;
}

function themeCss() {
    return '<style type="text/css">' +
        Object.keys(theme).map(cssClass => `.${cssClass} { color: ${theme[cssClass]}; }\n`).join('') +
        '</style>'
}

printHighlightedSpec.setTheme = function (colorTheme) {
    theme = colorTheme;
};

highlightedSpec.setTheme = function (colorTheme) {
    theme = colorTheme;
};