import { ClubGMS } from 'englandrugby-gms-parser';

const MYID = '165676';

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
  .then((club: ClubGMS) => {
    console.log(club.findPersonById(MYID))
  })