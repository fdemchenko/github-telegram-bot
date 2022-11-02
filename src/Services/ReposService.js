const octokit = require('../octokit');
const { restrictions } = require('../../botConfig');

class ReposService {
  static async getReposList(githubUsername) {
    const reposResponce = await octokit.request('GET /users/{username}/repos', {
      username: githubUsername
    });
    
    const reposList = reposResponce.data;
    return reposList.map(repo => {
      const { full_name, visibility, description, html_url, language, stargazers_count } = repo;
      return { full_name, visibility, description, html_url, language, stars: stargazers_count };
    });
  }

  static renderReposMessages(reposList) {
    const unitedReposText = reposList.map(repo => {
      return `<strong>${repo.full_name}</strong> (${repo.visibility})\n` + 
             `${repo.description ? '    Description: ' + repo.description + '\n' : ''}` + 
             `    Url: ${repo.html_url}\n` + 
             `${repo.language ? '    ' + 'Language: ' + repo.language + '\n' : ''}` + 
             `    ${repo.stars === 1 ? '1 star' : repo.stars + ' stars'}\n\n`;
    });
    
    const messagesList = ['Repositories:\n\n'];

    for (const unitedRepoText of unitedReposText) {
      const lastMessage = messagesList[messagesList.length - 1];
      if (lastMessage.length + unitedRepoText.length > restrictions.maxMessageLength) {
        messagesList.push(unitedRepoText);
      } else {
        messagesList[messagesList.length - 1] += unitedRepoText;
      } 
    }
    return messagesList;
  }
}

module.exports = ReposService;
