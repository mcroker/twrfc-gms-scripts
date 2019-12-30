import { ClubGMS, Person, AgeGrade } from 'englandrugby-gms-parser';
import * as nunjucks from 'nunjucks';

nunjucks.configure('templates', {
  autoescape: false
});

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'),
  { autoescape: false });;

env.addFilter('ismember', function (p: Person) {
  if (0 != p.memberships.filter((item) => { return (item.status == 'Active' && item.scheme != 'Associate') }).length) {
    return 'Yes'
  } else if (p.isMember) {
    return 'No (Sabatical)'
  } else {
    return '<span style="color:red">No</span>'
  }
});

env.addFilter('isplayer', function (p: Person) {
  if (p.isPlayer) {
    return 'Yes'
  } else {
    return '<span style="color:red">No</span>'
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

ClubGMS.createFromDirectory()
  .then(async (club: ClubGMS) => {

    const grade: AgeGrade = AgeGrade.under13;
    const people = club.findPeopleByAgeGrade(grade, false);
    const stats: GroupStats = {
      eligable: people.length,
      activeMembers: people.filter((item) => { return item.isMember }).length,
      pctActiveMembers: 100 * people.filter((item) => { return item.isMember }).length / people.length,
      registeredMembers: people.filter((item) => { return item.isPlayer }).length,
      pctRegisteredMembers: 100 * people.filter((item) => { return item.isPlayer }).length / people.length,
    };

    process.stdout.write(
      env.render('team_report.njk', { club: club, agegrade: grade, stats: stats })
    );
  })