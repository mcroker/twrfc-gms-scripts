import { ClubGMS } from 'englandrugby-gms-parser';
// import { QualifcationTypes } from './Qualifcation';
// import { Person } from './Person';
// const MYID = '165676';

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
  .then((club: ClubGMS) => {

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

    let coaches =club.findPeopleByMembershipScheme(/Coach/);
    console.log(coaches.length);

  });
