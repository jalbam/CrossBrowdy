var env = require('jsdoc/env'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

exports.handlers = {
    parseComplete: function (e) {
        var src = env.opts._.map(function (src) { return path.join(env.pwd, src); }),
          fd = fs.openSync(path.join(env.opts.destination, 'angular.jsdoc.search.data.js'), 'w'),
          data;

        data = e.doclets.filter(function(doclet) {
          return !doclet.undocumented && doclet.kind !== 'member';
        });

        fs.writeSync(fd, 'angular.module("search").constant("SEARCH_DATA", ');
        fs.writeSync(fd, JSON.stringify({ src: src, data: data }));
        fs.writeSync(fd, ');');
        fs.closeSync(fd);
    }
};
