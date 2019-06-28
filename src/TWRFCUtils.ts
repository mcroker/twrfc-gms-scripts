import { Membership, Person } from 'englandrugby-gms-parser';

export enum TWRFCSchemes {
  senior = 'Senior Player',
  family = 'Family Member',
  vets = 'Vets Player',
  concession = 'Concession',
  vp = 'VP',
  higherEd = 'Higher-Ed',
  youth = 'Youth Player',
  other = 'Other'
}

export class TWRFCUtils {

  static scoreMembership(person: Person, membership: Membership): number {
    let scheme = membership.scheme;
    let active = membership.isActive();
    let score = 0;
    if (scheme === 'Senior Player' && active) {
      score = 9;
    } else if (scheme.match(/family/i) && active) {
      score = 8;
    } else if (scheme === 'Veteran (Occasional Player)' && active) {
      score = 7;
    } else if (scheme === 'Concession' && active) {
      score = 6;
    } else if (scheme === 'Vice President (Social)' && active) {
      score = 5;
    } else if (scheme === 'Higher Education (Occasional Player)' && active) {
      score = 4;
    } else if (scheme == 'Youth Player' && active) {
      score = 3;
    }
    return score;
  }

  static normaliseScheme(scheme: string): string {
    if (scheme === 'Senior Player') {
      return TWRFCSchemes.senior;
    } else if (scheme.match(/family/i)) {
      return TWRFCSchemes.family;
    } else if (scheme === 'Veteran (Occasional Player)') {
      return TWRFCSchemes.vets;
    } else if (scheme === 'Concession') {
      return TWRFCSchemes.concession;
    } else if (scheme === 'Vice President (Social)') {
      return TWRFCSchemes.vp;
    } else if (scheme === 'Higher Education (Occasional Player)') {
      return TWRFCSchemes.higherEd;
    } else if (scheme == 'Youth Player') {
      return TWRFCSchemes.youth;
    } else {
      return TWRFCSchemes.other;
    }
  }

}
