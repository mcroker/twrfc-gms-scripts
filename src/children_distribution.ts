import { ClubGMS } from 'englandrugby-gms-parser';
import { TWRFCUtils, TWRFCSchemes } from './TWRFCUtils';
const printf = require('printf');

const TRACKEDSCHEMA = [
  TWRFCSchemes.senior,
  TWRFCSchemes.family,
  TWRFCSchemes.vets,
  TWRFCSchemes.concession,
  TWRFCSchemes.vp,
  TWRFCSchemes.higherEd,
  TWRFCSchemes.youth,
  TWRFCSchemes.other
];

declare interface CountArray { [name: string]: number[]; };

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
  .then((club: ClubGMS) => {

    let countallkids: CountArray = {};
    let countmemkids: CountArray = {};
    let countalladult: CountArray = {};
    let countmemadult: CountArray = {};
    for (let scheme of TRACKEDSCHEMA) {
      countallkids[scheme] = [0, 0, 0, 0, 0, 0];
      countmemkids[scheme] = [0, 0, 0, 0, 0, 0];
      countalladult[scheme] = [0, 0, 0, 0, 0, 0];
      countmemadult[scheme] = [0, 0, 0, 0, 0, 0];
    }

    for (var family of club.families) {
      let cmem = family.countChildren();
      let cnon = family.countChildren(false) - cmem;
      let amem = family.countAdults();
      let anon = family.countAdults(false) - amem;
      if ((cmem + amem) > 0) {
        let primary = family.getPrimaryData(TWRFCUtils.scoreMembership);
        let mainscheme = (undefined !== primary.membership) ? TWRFCUtils.normaliseScheme(primary.membership.scheme) : TWRFCSchemes.senior;
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
    for (let bucket of TRACKEDSCHEMA) {
      process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n',
        bucket,
        countmemkids[bucket][0],
        countmemkids[bucket][1],
        countmemkids[bucket][2],
        countmemkids[bucket][3],
        countmemkids[bucket][4],
        countmemkids[bucket][5]
      ));
    }

    console.log('');
    console.log('Everybody ==========');
    process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n', '', 0, 1, 2, 3, 4, 5));
    console.log('---------------------------------------------------');
    for (let bucket of TRACKEDSCHEMA) {
      process.stdout.write(printf('%-20s %5s %5s %5s %5s %5s\n',
        bucket,
        countallkids[bucket][0],
        countallkids[bucket][1],
        countallkids[bucket][2],
        countallkids[bucket][3],
        countallkids[bucket][4],
        countallkids[bucket][5]
      ));
    }

  })