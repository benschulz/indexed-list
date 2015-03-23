'use strict';

require(['require', 'chai'], function (require, chai) {
    mocha.setup('bdd');

    window.expect = chai.expect;

    require(['basic', 'sorted'], function () {
        window.__karma__.start();
    });

});
