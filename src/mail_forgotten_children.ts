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
    let forgottenChildren: Map<string, Person> = new Map<string, Person>();
    let agegrades: string[] = [];
    if (!person.isChild()) {
        for (let child of person.getChildren()) {
            if (!child.isMember) {
                forgottenChildren.set(child.rfuid, child);
                const agegrade = child.getAgeGrade()
                if (undefined !== agegrade) {
                    agegrades.push(agegrade);
                }
            }
        }
        const children = Array.from(forgottenChildren.values());
        const childrensNames = children.map((item) => item.getName());
        const firstNames = children.map((item) => item.firstName);
        if (children.length > 0) {
            console.log(person.getName(), ':', childrensNames.join(','));
            var mailOptions = {
                from: 'support@twrfc.com',
                to: person.getContactEmails(),
                cc: TWRFCUtils.getCoachEmails(agegrades),
                subject: 'Tunbridge Wells RFC - Did you forget to add ' + firstNames.join(',') + '?',
                text: 'Dear ' + person.firstName + ',\n'
                    + '\n'
                    + 'Thank-you for renewing your TWRFC membership.\n'
                    + '\n'
                    + 'You are receiving this email as whilst you are showing in the database as having membership for yourself, you have one (or more) children in GMS who don\'t appear to have membership associated, these are: ' + childrensNames + '\n'
                    + 'Despite you having paid, because you didn\'t add membership for them, these children will still be appearing in the coaches\' reports as non-members.\n'
                    + '\n'
                    + 'If this is intentional and they won\'t be playing at TWRFC - can you let me know at support@twrfc.com and I will remove them from the database (and you will stop getting these emails)\n'
                    + '\n'
                    + 'If it\'s an ommission - then it\'s really easy for you to fix using the instructions at http://twrfc.com/mem/fix\n'
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