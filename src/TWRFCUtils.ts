import { Membership, Person } from 'englandrugby-gms-parser';

export enum TWRFCSchemes {
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
      case TWRFCSchemes.senior:
        score = 9
        break;;
      case TWRFCSchemes.family:
        score = 8
        break;;
      case TWRFCSchemes.vets:
        score = 7
        break;;
      case TWRFCSchemes.concession:
        score = 6
        break;;
      case TWRFCSchemes.vp:
        score = 5
        break;;
      case TWRFCSchemes.higherEd:
        score = 4
        break;;
      case TWRFCSchemes.youth:
        score = 3
        break;;
      case TWRFCSchemes.social:
        score = 2
        break;;
      case TWRFCSchemes.other:
        score = 1
        break;;
    }
    return score + activeScore;
  }

  static normaliseScheme(scheme: string): TWRFCSchemes {
    if (scheme === 'Senior Player') {
      return TWRFCSchemes.senior;
    } else if (scheme === 'Veteran (Occasional Player)') {
      return TWRFCSchemes.vets;
    } else if (scheme === 'Concession') {
      return TWRFCSchemes.concession;
    } else if (scheme === 'Vice President (Social)') {
      return TWRFCSchemes.vp;
    } else if (scheme === 'Higher Education (Occasional Player)') {
      return TWRFCSchemes.higherEd;
    } else if (scheme === 'Youth Player') {
      return TWRFCSchemes.youth;
    } else if (scheme.match(/family/i)) {
      return TWRFCSchemes.family;
    } else if (scheme.match(/social/i)) {
      return TWRFCSchemes.higherEd;
    } else if (scheme === 'Associate') {
      return TWRFCSchemes.associate;
    } else if (scheme === 'Coach/Volunteer') {
      return TWRFCSchemes.volunteer;
    } else {
      console.log('WARNING: Scheme ' + scheme + ' not recognised.');
      return TWRFCSchemes.other;
    }
  }

}
