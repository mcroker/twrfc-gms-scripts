import { ClubGMS, Person } from 'englandrugby-gms-parser';
import * as nunjucks from 'nunjucks';
import { TWRFCAgeGrades } from './TWRFCUtils';
import * as nodemailer from 'nodemailer';
import { TWRFCUtils } from './TWRFCUtils';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mcroker@gmail.com',
    pass: process.env.GMAIL_PASSWORD
  }
});

function send(mailOptions: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
}
function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

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

    for (const grade of TWRFCAgeGrades) {

      const tolist = TWRFCUtils.getCoachEmails([grade]);
      if (undefined !== tolist && tolist !== '') {
        const people = club.findPeopleByAgeGrade(grade, false);
        const stats: GroupStats = {
          eligable: people.length,
          activeMembers: people.filter((item) => { return item.isMember }).length,
          pctActiveMembers: 100 * people.filter((item) => { return item.isMember }).length / people.length,
          registeredMembers: people.filter((item) => { return item.isPlayer }).length,
          pctRegisteredMembers: 100 * people.filter((item) => { return item.isPlayer }).length / people.length,
        };

        const mailOptions = {
          from: 'membership@twrfc.com',
          to: TWRFCUtils.getCoachEmails([grade]),
          subject: 'TWRFC Membership Report - ' + grade,
          html: env.render('team_report.njk', { club: club, agegrade: grade, stats: stats })
        }

        await send(mailOptions);
        await sleep(1000);
      }
    }
  })