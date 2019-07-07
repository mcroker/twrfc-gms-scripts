import { ClubGMS, AgeGrade } from 'englandrugby-gms-parser';

ClubGMS.createFromDirectory()
  .then((club: ClubGMS) => {
    for (var person of club.findPeopleByAgeGrade(AgeGrade.under6)) {
       console.log(person.getName(), person.getContactEmails())
    } 

  })