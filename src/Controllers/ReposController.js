const { User } = require('../models');
const octokit = require('../octokit');
const { RequestError } = require('@octokit/request-error');
const isAuthorized = require('../Utils/isAuthorized');
const ReposService = require('../Services/ReposService');

module.exports = class ReposController {
  constructor(telegramBot) {
    this.bot = telegramBot;

    this.myRepos = this.myRepos.bind(this);
  }

  async myRepos(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const githubUsername = await isAuthorized(userId);
    if (githubUsername === null) {
      return this.bot.sendMessage(chatId, 'You are not logged in');
    }

    try {
      const reposList = await ReposService.getReposList(githubUsername);
      const messagesList = ReposService.renderReposMessages(reposList);
      
      for (const message of messagesList) {
        this.bot.sendMessage(chatId, message, { parse_mode: 'html' });
      }
    } catch (e) {
      if (e instanceof RequestError) {
        this.bot.sendMessage(chatId, 'Network error');
      } else {
        this.bot.sendMessage(chatId, 'Internal error');
      }
      console.log(e);
    }
  }
};
