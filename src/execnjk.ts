import { ClubGMS } from 'englandrugby-gms-parser';
import * as nunjucks from 'nunjucks';


nunjucks.configure('templates', {
  autoescape: false
});

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'),
                          { autoescape: false });;

env.addFilter('yesno', function (b: boolean) {
  if (b) {
    return 'Yes'
  } else {
    return 'No'
  }
});

ClubGMS.createFromDirectory()
  .then((club: ClubGMS) => {
    process.stdout.write(env.render(process.argv[2] + '.njk', { club: club, argv: process.argv }));
  })