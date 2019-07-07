import { ClubGMS } from 'englandrugby-gms-parser';
// import * as tpl from './templates/age_group_contacts.njk';
import * as nunjucks from 'nunjucks';

nunjucks.configure('templates',{
  autoescape: false
});

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
  .then((club: ClubGMS) => {
      process.stdout.write(nunjucks.render('age_group_contacts.njk', { club: club }));

/*
    for (var person of club.getPeople().filter((item) => {
      return (undefined !== item.ageAtStartOfSeason && item.ageAtStartOfSeason < 6 && item.ageAtStartOfSeason >= 4)
    })) {
      // console.log(person.getName(), person.getContactEmails())
    } */

  })