'use strict';

module.exports = function (grunt) {
    require('grunt-commons')(grunt, {
        name: 'indexed-list',
        main: 'exported',
        internalMain: 'indexed-list'
    }).initialize({});
};
