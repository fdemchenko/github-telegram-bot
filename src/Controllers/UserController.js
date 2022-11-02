const { User } = require('../models');
const octokit = require('../octokit');
const { RequestError } = require('@octokit/request-error');

module.exports =  class UserController {
  constructor(telegramBot) {
    this.bot = telegramBot;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getMe = this.getMe.bind(this);
  }

  async login(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const requestedUsername = match[1];
    
    try {
      const userResponce = await octokit.request('GET /users/{username}', {
        username: requestedUsername
      });

      const user = await User.findOne({ where: { tg_user_id: userId } });

      if (user) {
        await User.update(
          { gh_username: requestedUsername },
          { where: { tg_user_id: userId } }
        );
      } else {
        await User.create({ tg_user_id: userId, gh_username: requestedUsername });
      }

      this.bot.sendMessage(chatId, 'You are logged in as ' + requestedUsername);
    } catch (e) {
      if (e instanceof RequestError) {
        this.bot.sendMessage(chatId, 'This user doesn\'t exist!');
      } else {
        console.log(e);
      }
    }

  }

  async logout(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
      const user = await User.findOne({ where: { tg_user_id: userId } });
      if (!user) {
        this.bot.sendMessage(chatId, 'You are not logged in');
      } else {
        User.destroy({ where: { tg_user_id: userId  } });
        this.bot.sendMessage(chatId, 'Good bye!');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getMe(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
      const user = await User.findOne({ where: { tg_user_id: userId } });
      if (!user) {
        this.bot.sendMessage(chatId, 'You are not logged in');
      } else {
        this.bot.sendMessage(chatId, user['gh_username']);
      }
    } catch (e) {
      console.log(e);
    }
  }
};
