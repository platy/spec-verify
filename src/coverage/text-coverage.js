//TODO: score coverage based on keywords
//TODO: highlight keywords which are not covered

class TextCoverageResult {
    constructor(markers, body){
        this.markers = markers;
        this.body = body;
    }
    get marked() {
        var marked = [];
        var pos = 0, covered = 0;
        for(var marker of this.allOrderedMarkers) {
            if (marker.start > pos) {
                marked.push({covered: false, text: this.body.substr(pos, marker.start - pos)});
                pos = marker.start; // skip any gap
            }if (marker.end > pos) {
                marked.push({covered: true, text: this.body.substr(pos, marker.end - pos)});
                covered = covered + marker.end - pos;
                pos = marker.end;
            }
        }
        marked.push({covered: false, text: this.body.substr(pos, this.body.length - pos)});
        return marked;
    }
    get unmatched() {
        return this.markers.filter(m => {
            return m.length == 0;
        }).map(m => {
            return m.assertion;
        })
    }
    get allOrderedMarkers() {
        return Array.prototype.concat.apply([], this.markers).sort((a, b) => {
            if(a.start == b.start)
                return a.end - b.end;
            else
                return a.start - b.start;
        });
    }
    get coverageChars() {
        var pos = 0, covered = 0;
        for(var marker of this.allOrderedMarkers) {
            if (marker.start > pos)
                pos = marker.start; // skip any gap
            if (marker.end > pos) {
                covered = covered + marker.end - pos;
                pos = marker.end;
            }
        }
        return covered;
    }
    get coveragePercent() {
        return this.coverageChars / this.body.length * 100;
    }
}

function escapeRegExp(str) {
    // http://stackoverflow.com/a/6969486/961581
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function findAll(substring, string) {
    var matcher = new RegExp(escapeRegExp(substring).replace(/\s+/g, "\\s+"), 'g');
    var ms = [];
    var start = -1;
    for(;;) {
        var result = matcher.exec(string);
        if (!result)
            return ms;
        start = result.index;
        ms.push({start, end: start + result[0].length});
    }
}

export default function(assertions, spec) {
    var markers = assertions.map(assertion => {
        var markers = findAll(assertion.description, spec);
        markers.assertion = assertion;
        return markers;
    });
    return new TextCoverageResult(markers, spec);
}