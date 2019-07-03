import { ClubGMS } from 'englandrugby-gms-parser';
import { TWRFCUtils } from './TWRFCUtils';

const printf = require('printf');

ClubGMS.createFromGMSExports('./data/people.csv', './data/members.csv')
    .then((club: ClubGMS) => {

        const OUTFORMAT = '%-22s %5s\n';
        const HR = '----------------------------\n'

        process.stdout.write(printf(OUTFORMAT + HR,
            'Scheme',
            '#Mem'
        ));

        for (let scheme of club.getNormalisedSchemes(TWRFCUtils.normaliseScheme)) {
            let activeMembers = scheme.getCountActiveMembers();
            process.stdout.write(printf(OUTFORMAT,
                scheme.name,
                activeMembers
            ));
        }

    })