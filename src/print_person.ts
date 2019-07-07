import { ClubGMS } from 'englandrugby-gms-parser';

const PERSONID = process.argv[2];

ClubGMS.createFromDirectory()
  .then((club: ClubGMS) => {
    console.log(club.findPersonById(PERSONID))
  })