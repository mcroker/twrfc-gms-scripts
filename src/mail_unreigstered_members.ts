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
    if (!person.isChild()) {
        for (let child of person.getChildren()) {
            if (child.isMember && !child.isPlayer) {
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
                subject: 'Tunbridge Wells RFC - Did you forget to register ' + firstNames.join(',') + '?',
                text: 'Dear ' + person.firstName + ',\n'
                    + '\n'
                    + 'Thank-you for renewing your TWRFC membership.\n'
                    + '\n'
                    + 'You are receiving this email as you have one (or more) children who have membership, but are not currently registered as players.\n'
                    + 'These are: ' + childrensNames + '\n'
                    + '\n'
                    + 'Somewhat counter-intuatively age-grade player registration is a totally separate process from membership and required inorder to play age-grade rugby (even at U6s!). Additionally the coaches can only see details for registered players in their team reports.\n'
                    + '\n'
                    + 'If this is intentional and they won\'t be playing at TWRFC - can you let me know at support@twrfc.com and I will remove them from the database (and you will stop getting these emails)\n'
                    + '\n'
                    + 'If it\'s an ommission - then it\'s really easy for you to register the online using the instructions at http://twrfc.com/reg/update\n'
                    + '\n'
                    + 'Thanks\nMartin'
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