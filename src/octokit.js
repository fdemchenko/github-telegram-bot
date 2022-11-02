const { Octokit, App } = require("octokit");
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

module.exports = new Octokit({ 
  auth: GITHUB_ACCESS_TOKEN 
});
