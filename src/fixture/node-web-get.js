// Basic fixture loader which takes only a uri as a parameter, requests the content for that uri using the most default
// settings and then attempts to provide all the entities it can find in a the most conventional way it knows.
// Intended to support things other than http as well.

// TODO: find something other than http which can do a similar thing - as a proof - local filesystem / ftp ?

var http = require('http-request');

export function load([url], callback) {
    http.get(url, function(err, res) {
        if (err) {
            console.error(err);
            return;
        }
        callback(['document', JSON.parse(res.buffer.toString('utf-8'))]);
    });
}

export var key = 'web-get';
