import { ClubGMS } from 'englandrugby-gms-parser';
// import { QualifcationTypes } from './Qualifcation';
// import { Person } from './Person';
// const MYID = '165676';

ClubGMS.createFromDirectory()
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

    let coaches = club.findPeopleByMembershipScheme(/Coach/);
    console.log(coaches.length);

    for (let person of club.getPeople()) {
      // person.getAgeAtStartOfSeason("2019");
      console.log(person.getName(), person.title, person.ageAtStartOfSeason, person.DOB, person.getInferredGender(), person.getAgeGrade());
    }

  });
