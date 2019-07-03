import { ClubGMS } from 'englandrugby-gms-parser';
// import { TWRFCUtils, TWRFCSchemes } from './TWRFCUtils';
// const printf = require('printf');

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
  .then((club: ClubGMS) => {


    for (var person of club.getPeople().filter((item) => {
      return (undefined !== item.ageAtStartOfSeason && item.ageAtStartOfSeason < 6 && item.ageAtStartOfSeason >= 4)
    })) {
      console.log(person.getName(), person.getContactEmails())
    }

  })