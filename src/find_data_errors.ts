import { ClubGMS, Person } from 'englandrugby-gms-parser';
const printf = require('printf');

const OUTFORMAT = '%-8s %-8s %-25s %s\n';
const HR = '--------------------------------------------------------------------------------------------------\n'

function reportDataError(person: Person, errorMessage: string) {
    let agegrade = (undefined !== person.getAgeGrade()) ? person.getAgeGrade() : '';
    process.stdout.write(printf(OUTFORMAT, person.rfuid, agegrade, person.getName(), errorMessage));
}

ClubGMS.createFromDirectory()
    .then((club: ClubGMS) => {

        process.stdout.write(printf(OUTFORMAT + HR, 'Group', 'RFU ID', 'Name', 'Message'));

        for (let person of club.getPeople().filter((item) => item.isMember)) {
            if (person.isChild()) {
                if (person.getParents().length === 0 && person.getChildren().length > 0) {
                    reportDataError(person, 'child has no parent but has children (wrong DOB?)');
                }
                else if (person.getParents().length === 0) {
                    reportDataError(person, 'child has no parents');
                }
                else if (person.getChildren().length > 0)
                    reportDataError(person, 'child has children');
            }
        }

        for (let member of club.findPeopleByMembershipScheme(/Family/)) {
            if (member.isChild()) {
                reportDataError(member, 'Has family membership but is a child');
            } else {
                if (member.getChildren().length === 0) {
                    reportDataError(member, 'Has family membership but no children');
                }
                for (let child of member.getChildren()) {
                    if (!child.isMember) {
                        reportDataError(child, 'Is not a youth member but parent is a family member');
                    }
                }
            }
        }

        for (let member of club.findPeopleByMembershipScheme(/Senior/)) {
            if (member.isChild()) {
                reportDataError(member, 'Has senior membership but is a child');
            } else {
                for (let child of member.getChildren()) {
                    if (!child.isMember) {
                        reportDataError(child, 'Is not a youth member but parent is a senior member');
                    }
                }
            }
        }

    })