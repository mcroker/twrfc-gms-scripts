import { ClubGMS } from 'englandrugby-gms-parser';
import { TWRFCUtils } from './TWRFCUtils';

const printf = require('printf');

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
    .then((club: ClubGMS) => {

        const OUTFORMAT = '%-20s %5s\n';
        process.stdout.write(printf(OUTFORMAT,
            'Scheme',
            '#Mem'
        ));
        process.stdout.write('--------------------------\n');

        for (let scheme of club.getNormalisedSchemes(TWRFCUtils.normaliseScheme)) {
            process.stdout.write(printf(OUTFORMAT,
                scheme.name,
                scheme.getCountActiveMembers()
            ));
        }

    })