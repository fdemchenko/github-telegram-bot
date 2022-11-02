const { restrictions } = require('../../botConfig');
const octokit = require('../octokit.js');
const { RequestError } = require('@octokit/request-error');


module.exports = class GitignoreController {
  constructor(telegramBot) {
    this.bot = telegramBot;
    this.getGitignore = this.getGitignore.bind(this);
  }

  async getGitignore(msg, match) {
    const chatId = msg.chat.id;
    const requestedLanguage = match[1].toLowerCase();
    
    try {
      const { data } = await octokit.request('GET /gitignore/templates', {});
      
      const languageName = data.find(item => item.toLowerCase() === requestedLanguage);
      if (typeof languageName === 'undefined') {
        return this.bot.sendMessage(chatId, 'Possible variants:\n\n' + data.join('\n'));
      }

      const gitignoreResponce = await octokit.request('GET /gitignore/templates/{name}', {
        name: languageName
      });
      const gitignoreSource = gitignoreResponce.data.source;


      if (gitignoreSource.length > restrictions.maxMessageLength) {
        const fileBuffer = Buffer.from(gitignoreSource);
        this.bot.sendDocument(chatId, fileBuffer, {}, { filename: '.gitignore', contentType: 'text/plain' });
      } else {
        this.bot.sendMessage(chatId, gitignoreSource);
      }

    } catch (e) {
      if (e instanceof RequestError) {
        this.bot.sendMessage(chatId, 'Network error');
      } else {
        this.bot.sendMessage(chatId, 'Internal error');
      }
    }
  }
};
