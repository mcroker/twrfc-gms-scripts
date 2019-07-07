import { ClubGMS } from 'englandrugby-gms-parser';
import * as nunjucks from 'nunjucks';

nunjucks.configure('templates', {
  autoescape: false
});

ClubGMS.createFromDirectory()
  .then((club: ClubGMS) => {
    process.stdout.write(nunjucks.render(process.argv[2] + '.njk', { club: club }));
  })