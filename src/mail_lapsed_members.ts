import { ClubGMS, Person } from 'englandrugby-gms-parser';
import { TWRFCUtils } from './TWRFCUtils';

import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mcroker@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});  

function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
} 

export function send(mailOptions: any): Promise<any> {
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

async function proc(person: Person) {
    let unRegMems: Map<string, Person> = new Map<string, Person>();
    let agegrades: string[] = [];
    if (!person.isChild() && !person.isMember) {
        for (let child of person.getChildren()) {
            if (!child.isMember && child.memberships.filter((item) => { return (undefined !== item.validTo && item.status === 'Lapsed' && item.validTo.getFullYear() === 2019) }).length > 0) {
                console.log(child.getName());
                unRegMems.set(child.rfuid, child);
                const agegrade = child.getAgeGrade()
                if (undefined !== agegrade) {
                    agegrades.push(agegrade);
                }
            }
        }
        const children = Array.from(unRegMems.values());
        const childrensNames = children.map((item) => item.getName());
        const firstNames = children.map((item) => item.firstName);
        if (children.length > 0) {
            console.log(person.getName(), ':', childrensNames.join(','));
            var mailOptions = {
                from: 'support@twrfc.com',
                to: person.getContactEmails(),
                cc: TWRFCUtils.getCoachEmails(agegrades),
                subject: 'Tunbridge Wells RFC - Membership reminder - ' + firstNames.join(','),
                text: 'Dear ' + person.firstName + ',\n'
                    + '\n'
                    + 'I am contact you as one or more of your children had active membership with TWRFC last-season but seems to not have renewed this season.\n'
                    + 'These are: ' + childrensNames + '\n'
                    + '\n'
                    + 'If you had already discussed this with your team-manager or think this is an error (and with GMS all things are possible), then please reply to this email and I\'ll try and resolve things.\n'
                    + '\n'
                    + 'If this is intentional and they have made the catestrophic decision to no longer play rugby at TWRFC (shame!) can you let me know at support@twrfc.com and I will remove them from the database (and you will stop getting these emails).  I\'m sure the coaches would apprecate an email too.\n'
                    + '\n'
                    + 'Otherwise we\'d be very grateful if you would renew the membership ASAP, and not to put too blunt a point on it... pay! Membership subscriptions are a really important part of the club\'s income without which we would not be able to opperate. '
                    + 'If you are unable to pay or require special considerations, then there a number of options including the Anthony Clarke memorial fund which was established to help those who really require it - please get in touch and we can discuss options.\n'
                    + '\n'
                    + 'There is an online guide at twrfc.com/mem/buy\n'
                    + '\n'
                    + 'Thanks\nMartin\nTWRFC Membership Secretary'
            }; 

            await send(mailOptions);
            await sleep(1000);

        }
    }
}

ClubGMS.createFromDirectory()
    .then(async (club: ClubGMS) => {

        for (let member of club.findPeopleByMembershipScheme(/Family/)) {
            await proc(member);
        }

        for (let member of club.findPeopleByMembershipScheme(/Senior/)) {
            await proc(member);
        }

    });