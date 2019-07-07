import { Membership, Person, AgeGrade } from 'englandrugby-gms-parser';

export const TWRFCAgeGrades = [
 AgeGrade.under6,
 AgeGrade.under7,
 AgeGrade.under8,
 AgeGrade.under9,
 AgeGrade.under10,
 AgeGrade.under11,
 AgeGrade.under12,
 AgeGrade.under13,
 AgeGrade.under14,
 AgeGrade.under15,
 AgeGrade.under16,
 AgeGrade.colts,
 AgeGrade.under13ladies,
 AgeGrade.under15ladies,
 AgeGrade.under18ladies
]

export enum TWRFCScheme {
  senior = 'Senior Player',
  family = 'Parent (Family Member)',
  vets = 'Vets Player',
  concession = 'Concession',
  vp = 'VP',
  higherEd = 'Higher-Ed',
  youth = 'Youth Player',
  social = 'Social Member',
  associate = 'Associate',
  volunteer = 'Coach/Volunteer',
  other = 'Other'
}

export class TWRFCUtils {

  static scoreMembership(person: Person, membership: Membership): number {
    let scheme = TWRFCUtils.normaliseScheme(membership.scheme);
    let activeScore = membership.isActive() ? 100 : 0; // An active membership always trumps and expired one
    let score = 0;
    switch (scheme) {
      case TWRFCScheme.senior:
        score = 9
        break;;
      case TWRFCScheme.family:
        score = 8
        break;;
      case TWRFCScheme.vets:
        score = 7
        break;;
      case TWRFCScheme.concession:
        score = 6
        break;;
      case TWRFCScheme.vp:
        score = 5
        break;;
      case TWRFCScheme.higherEd:
        score = 4
        break;;
      case TWRFCScheme.youth:
        score = 3
        break;;
      case TWRFCScheme.social:
        score = 2
        break;;
      case TWRFCScheme.volunteer:
      case TWRFCScheme.associate:
      case TWRFCScheme.other:
        score = 1
        break;;
    }
    return score + activeScore;
  }

  static normaliseScheme(scheme: string): TWRFCScheme {
    if (scheme === 'Senior Player') {
      return TWRFCScheme.senior;
    } else if (scheme === 'Veteran (Occasional Player)') {
      return TWRFCScheme.vets;
    } else if (scheme === 'Concession') {
      return TWRFCScheme.concession;
    } else if (scheme === 'Vice President (Social)') {
      return TWRFCScheme.vp;
    } else if (scheme === 'Higher Education (Occasional Player)') {
      return TWRFCScheme.higherEd;
    } else if (scheme === 'Youth Player') {
      return TWRFCScheme.youth;
    } else if (scheme.match(/family/i)) {
      return TWRFCScheme.family;
    } else if (scheme.match(/social/i)) {
      return TWRFCScheme.higherEd;
    } else if (scheme === 'Associate') {
      return TWRFCScheme.associate;
    } else if (scheme === 'Coach/Volunteer') {
      return TWRFCScheme.volunteer;
    } else {
      console.log('WARNING: Scheme ' + scheme + ' not recognised.');
      return TWRFCScheme.other;
    }
  }

}
