import { ClubGMS } from 'englandrugby-gms-parser';
import * as nunjucks from 'nunjucks';
import { TWRFCAgeGrades } from './TWRFCUtils';
const printf = require('printf');

nunjucks.configure('templates', {
  autoescape: false
});

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'),
  { autoescape: false });;

env.addFilter('yesno', function (b: boolean) {
  if (b) {
    return 'Yes'
  } else {
    return 'No'
  }
});

type GroupStats = {
  eligable: number,
  activeMembers: number,
  registeredMembers: number
  emergencyDetailsCompleted?: number
  pctActiveMembers: number,
  pctRegisteredMembers: number
}

let stats: { [group: string]: GroupStats; } = {};
let totalstats: GroupStats = {
  eligable: 0,
  activeMembers: 0,
  registeredMembers: 0,
  emergencyDetailsCompleted: 0,
  pctActiveMembers: 0,
  pctRegisteredMembers: 0
};

const OUTFORMAT = '%10s %10d %10d %10d%% %10d %10d%%\n'
const HR = '-------------------------------------------------------------------\n';


ClubGMS.createFromDirectory()
  .then((club: ClubGMS) => {
    process.stdout.write(printf('%10s %10s %10s %10s %10s %10s\n' + HR, 'AGE-GRADE', 'PEOPLE', 'MEMBERS', '%MEMBERS', 'REGD', '%REGD'));
    for (const grade of TWRFCAgeGrades) {
      const people = club.findPeopleByAgeGrade(grade, false);
      stats[grade] = {
        eligable: people.length,
        activeMembers: people.filter((item) => { return item.isMember }).length,
        pctActiveMembers: 100 * people.filter((item) => { return item.isMember }).length / people.length,
        registeredMembers: people.filter((item) => { return item.isPlayer }).length,
        pctRegisteredMembers: 100 * people.filter((item) => { return item.isPlayer }).length / people.length,
      };
      totalstats.eligable += stats[grade].eligable;
      totalstats.activeMembers += stats[grade].activeMembers;
      totalstats.registeredMembers += stats[grade].registeredMembers;
      process.stdout.write(printf(OUTFORMAT, grade, stats[grade].eligable, stats[grade].activeMembers, stats[grade].pctActiveMembers, stats[grade].registeredMembers, stats[grade].pctRegisteredMembers));
    }
    totalstats.pctActiveMembers = 100 * totalstats.activeMembers / totalstats.eligable;
    totalstats.pctRegisteredMembers = 100 * totalstats.registeredMembers /totalstats.eligable;
      process.stdout.write(printf(HR + OUTFORMAT, 'Total', totalstats.eligable, totalstats.activeMembers, totalstats.pctActiveMembers, totalstats.registeredMembers, totalstats.pctRegisteredMembers));
  })