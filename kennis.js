import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import MiniSearch from 'minisearch';
import { v4 as uuid } from 'uuid';

const log = console.log;
const dbFile = './db.json';
let search = null;
let db = [];

function createSearch() {
  search = new MiniSearch({
    fields: ['q', 'a'],
    storeFields: ['q', 'a'],
  });
  try {
      search.addAll(db);
  } catch (e) {
      log(chalk.red('Error creating search index' + e));
  }
}

function loadDb() {
  db = JSON.parse(fs.readFileSync(dbFile));
  createSearch();
}

function saveDb() {
  fs.writeFileSync(dbFile, JSON.stringify(db));
}

function dbMerger(args) {
    const filePath = args[0];
    loadDb();
    if (!fs.existsSync(filePath)) {
        log(chalk.red(`Db file does not found ${filePath}`));
        return;
    }
    const db2 = JSON.parse(fs.readFileSync(args[0]));
    db2.forEach(pair => {
        if (!db.find(p => p.q === pair.q)) {
            const newPair = { ...pair, id: uuid() };
            db.push(newPair);
        }
    });
    saveDb();
}

function showHelp(){
  log(chalk.blue('This is an small CLI app to store questions and answers as your own small knowledge base'));
  log('Usage:', chalk.green('kennis [command] [args]'));
  log('help (or h) - Displays help');
  log('new (or n) - Creates a new pair or questions and answers');
  log('search (or s) - Full text search for terms in questions and answers');
  log('merge - Merges two databases, the second DB file path is passed as argument');
}

async function newPair(args) {
  const pair = { id: uuid(), q: args?.[0] || '', a: args?.[1] || '' };

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
  'merge': dbMerger,
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
