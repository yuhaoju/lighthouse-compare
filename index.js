const fs = require('fs');
const { execSync } = require('child_process');
const superagent = require('superagent');

const {
  TRAVIS_PULL_REQUEST_SHA,
  TRAVIS_COMMIT,
  TRAVIS_REPO_SLUG,
  TRAVIS_JOB_ID,
  TRAVIS_PULL_REQUEST,
} = process.env;

const reportName = './lh-report.json';

function launchChromeAndRunLighthouse(url) {
  // use cli to disable network throttling, lighthouse doesn't support disable it programally
  execSync(
    `./node_modules/.bin/lighthouse ${url} --output=json --output-path=${reportName} --quiet ` +
    '--disable-device-emulation --chrome-flags="--no-sandbox --headless --disable-gpu --window-size=1920,1080" ' +
    '--throttling.rttMs=70 --throttling.throughputKbps=12000000'
  );
  return JSON.parse(fs.readFileSync(reportName, 'utf-8'));
}

async function sendReport(audits, categories) {
  const apiUrl = 'https://lighthouse-compare-service.herokuapp.com/api/report/create';
  const postData = {
    commit_hash: TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT,
    repo_id: TRAVIS_REPO_SLUG,
    job_id: TRAVIS_JOB_ID,
    is_master: TRAVIS_PULL_REQUEST === 'false',
    audits,
    categories,
  };
  await superagent
    .post(apiUrl)
    .send(postData)
    .set('Content-Type', 'application/json')
}

async function main(options) {
  const { url } = options || {};
  const { audits: rawAudits, categories: rawCategories } = launchChromeAndRunLighthouse(url);

  const audits = [];
  Object.keys(rawAudits).forEach((name) => {
    const { score, id } = rawAudits[name];
    audits.push({
      name: id,
      score: Math.round(score * 100),
    });
  });

  const categories = [];
  Object.keys(rawCategories).forEach((name) => {
    const { title, score } = rawCategories[name];
    categories.push({
      name: title,
      score:  Math.round(score * 100),
    });
  });

  try {
    await sendReport(audits, categories);
    console.log(`[lighthouse-compare] Report sent! Please check https://lighthouse-compare-service.herokuapp.com/app/${TRAVIS_REPO_SLUG}/report/${TRAVIS_JOB_ID}`);
  } catch (error) {
    console.log('Encounter an error when posting data.');
  }
}

exports.run = main;
