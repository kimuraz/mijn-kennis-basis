import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import MiniSearch from 'minisearch';

const log = console.log;
const dbFile = './db.json';
let search = null;
let db = [];

function createSearch() {
  search = new MiniSearch({
    fields: ['q', 'a'],
    storeFields: ['q', 'a'],
  });
  search.addAll(db);
}

function loadDb() {
  db = JSON.parse(fs.readFileSync(dbFile));
  createSearch();
}

function saveDb() {
  fs.writeFileSync(dbFile, JSON.stringify(db));
}

function showHelp(){
  log(chalk.blue('This is an small CLI app to store questions and answers as your own small knowledge base'));
  log('Usage:', chalk.green('kennis [command] [args]'));
  log('help (or h) - Displays help');
  log('new (or n) - Creates a new pair or questions and answers');
  log('search (or s) - Full text search for terms in questions and answers');
}

async function newPair(args) {
  const pair = { id: (new Date()).getTime(), q: args?.[0] || '', a: args?.[1] || '' };

  if (!pair.q || !pair.a) {
    const answers = await inquirer.prompt(['Question', 'Answer']);
    pair.q = answers[0];
    pair.a = answers[1];
  }

  db.push(pair);
  saveDb();
}

function searchPair(args){
  const query = args.join(' ');
  log('Search for', chalk.cyan(query), '\n');

  let results;
  if (query === 'all') {
    results = db;
  } else {
    results = search.search(query, { fuzzy: 0.2, prefix: term => term.length > 2 });
    if (!results.length) {
      log(chalk.red('=== No results ==='));
      return;
    }
  }

  results.forEach(pair => {
    log(chalk.white(pair.q));
    const answers = pair.a.split('+');
    answers.forEach(a => {
      log('>', chalk.green(a.trim()));
    });
    log('-----------------------------------------');
  });

  log(chalk.yellowBright('Results: ' + results.length));
}

const commands = {
  'new': newPair,
  'n': newPair,
  'h': showHelp,
  'help': showHelp,
  'search': searchPair,
  's': searchPair,
};


// Prompt user with option if there are no args
function cli() {
  const args = [...process.argv];
  if (args.length < 2) {
     showHelp();
  }
  const command = args[2];
  if (!commands[command]) {
     showHelp();
     return;
  }
  args.splice(0, 3);
  if (!(['h', 'help'].includes(command))) {
    loadDb();
  }
  commands[command](args);
}

cli();
