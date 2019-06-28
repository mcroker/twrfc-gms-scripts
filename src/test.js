"use strict";
exports.__esModule = true;
var englandrugby_gms_tools_1 = require("englandrugby-gms-tools");
// import { QualifcationTypes } from './Qualifcation';
// import { Person } from './Person';
// const MYID = '165676';
englandrugby_gms_tools_1.ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
    .then(function (club) {
    // Find by membership schmee
    /*
    let coaches =club.findPeopleByMembershipScheme('Youth Player');
    coaches.forEach(element => {
      console.log(element.getName());
    });
    */
    /*
    let me: Person | undefined = club.findPersonById(MYID);
    if (undefined !== me) {
      console.log(me.belongsToScheme(/Discount/));
    }
    */
    var coaches = club.findPeopleByMembershipScheme(/Coach/);
    console.log(coaches.length);
});
