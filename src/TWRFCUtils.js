"use strict";
exports.__esModule = true;
var TWRFCSchemes;
(function (TWRFCSchemes) {
    TWRFCSchemes["senior"] = "Senior Player";
    TWRFCSchemes["family"] = "Family Member";
    TWRFCSchemes["vets"] = "Vets Player";
    TWRFCSchemes["concession"] = "Concession";
    TWRFCSchemes["vp"] = "VP";
    TWRFCSchemes["higherEd"] = "Higher-Ed";
    TWRFCSchemes["youth"] = "Youth Player";
    TWRFCSchemes["other"] = "Other";
})(TWRFCSchemes = exports.TWRFCSchemes || (exports.TWRFCSchemes = {}));
var TWRFCUtils = /** @class */ (function () {
    function TWRFCUtils() {
    }
    TWRFCUtils.scoreMembership = function (person, membership) {
        var scheme = membership.scheme;
        var active = membership.isActive();
        var score = 0;
        if (scheme === 'Senior Player' && active) {
            score = 9;
        }
        else if (scheme.match(/family/i) && active) {
            score = 8;
        }
        else if (scheme === 'Veteran (Occasional Player)' && active) {
            score = 7;
        }
        else if (scheme === 'Concession' && active) {
            score = 6;
        }
        else if (scheme === 'Vice President (Social)' && active) {
            score = 5;
        }
        else if (scheme === 'Higher Education (Occasional Player)' && active) {
            score = 4;
        }
        else if (scheme == 'Youth Player' && active) {
            score = 3;
        }
        return score;
    };
    TWRFCUtils.normaliseScheme = function (scheme) {
        if (scheme === 'Senior Player') {
            return TWRFCSchemes.senior;
        }
        else if (scheme.match(/family/i)) {
            return TWRFCSchemes.family;
        }
        else if (scheme === 'Veteran (Occasional Player)') {
            return TWRFCSchemes.vets;
        }
        else if (scheme === 'Concession') {
            return TWRFCSchemes.concession;
        }
        else if (scheme === 'Vice President (Social)') {
            return TWRFCSchemes.vp;
        }
        else if (scheme === 'Higher Education (Occasional Player)') {
            return TWRFCSchemes.higherEd;
        }
        else if (scheme == 'Youth Player') {
            return TWRFCSchemes.youth;
        }
        else {
            return TWRFCSchemes.other;
        }
    };
    return TWRFCUtils;
}());
exports.TWRFCUtils = TWRFCUtils;
