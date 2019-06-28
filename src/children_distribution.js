"use strict";
exports.__esModule = true;
var englandrugby_gms_tools_1 = require("englandrugby-gms-tools");
var TWRFCUtils_1 = require("./TWRFCUtils");
var printf = require('printf');
var TRACKEDSCHEMA = [
    TWRFCUtils_1.TWRFCSchemes.senior,
    TWRFCUtils_1.TWRFCSchemes.family,
    TWRFCUtils_1.TWRFCSchemes.vets,
    TWRFCUtils_1.TWRFCSchemes.concession,
    TWRFCUtils_1.TWRFCSchemes.vp,
    TWRFCUtils_1.TWRFCSchemes.higherEd,
    TWRFCUtils_1.TWRFCSchemes.youth,
    TWRFCUtils_1.TWRFCSchemes.other
];
;
englandrugby_gms_tools_1.ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
    .then(function (club) {
    var countallkids = {};
    var countmemkids = {};
    var countalladult = {};
    var countmemadult = {};
    for (var _i = 0, TRACKEDSCHEMA_1 = TRACKEDSCHEMA; _i < TRACKEDSCHEMA_1.length; _i++) {
        var scheme = TRACKEDSCHEMA_1[_i];
        countallkids[scheme] = [0, 0, 0, 0, 0, 0];
        countmemkids[scheme] = [0, 0, 0, 0, 0, 0];
        countalladult[scheme] = [0, 0, 0, 0, 0, 0];
        countmemadult[scheme] = [0, 0, 0, 0, 0, 0];
    }
    for (var _a = 0, _b = club.families; _a < _b.length; _a++) {
        var family = _b[_a];
        var cmem = family.countChildren();
        var cnon = family.countChildren(false) - cmem;
        var amem = family.countAdults();
        var anon = family.countAdults(false) - amem;
        if ((cmem + amem) > 0) {
            var primary = family.getPrimaryData(TWRFCUtils_1.TWRFCUtils.scoreMembership);
            var mainscheme = (undefined !== primary.membership) ? TWRFCUtils_1.TWRFCUtils.normaliseScheme(primary.membership.scheme) : TWRFCUtils_1.TWRFCSchemes.senior;
            countallkids[mainscheme][cmem + cnon] += 1;
            countmemkids[mainscheme][cmem] += 1;
            countalladult[mainscheme][amem + anon] += 1;
            countmemadult[mainscheme][amem] += 1;
        }
    } // Each Family
    // Only members
    console.log('Members ==========');
    process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n', '', 0, 1, 2, 3, 4, 5));
    console.log('---------------------------------------------------');
    for (var _c = 0, TRACKEDSCHEMA_2 = TRACKEDSCHEMA; _c < TRACKEDSCHEMA_2.length; _c++) {
        var bucket = TRACKEDSCHEMA_2[_c];
        process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n', bucket, countmemkids[bucket][0], countmemkids[bucket][1], countmemkids[bucket][2], countmemkids[bucket][3], countmemkids[bucket][4], countmemkids[bucket][5]));
    }
    console.log('');
    console.log('Everybody ==========');
    process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n', '', 0, 1, 2, 3, 4, 5));
    console.log('---------------------------------------------------');
    for (var _d = 0, TRACKEDSCHEMA_3 = TRACKEDSCHEMA; _d < TRACKEDSCHEMA_3.length; _d++) {
        var bucket = TRACKEDSCHEMA_3[_d];
        process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n', bucket, countallkids[bucket][0], countallkids[bucket][1], countallkids[bucket][2], countallkids[bucket][3], countallkids[bucket][4], countallkids[bucket][5]));
    }
});
