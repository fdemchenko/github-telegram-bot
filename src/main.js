require('dotenv').config({ override: true });
const TelegramBot = require('node-telegram-bot-api');
const GitignoreController = require('./Controllers/GitignoreController');
const UserController = require('./Controllers/UserController');
const sequelize = require('./db');
const models = require('./models');

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const bot = new TelegramBot(TG_BOT_TOKEN, { polling: true });

const gitignoreController = new GitignoreController(bot);
const userController = new UserController(bot);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database user authenticated successfully');
    await sequelize.sync();
    console.log('Tables were synchronized successfully');
  } catch (e) {
    console.log('Database Error!');
  }
};

main();

bot.onText(/\/start/, msg => {
  const name = msg.from.first_name;
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Hello, ' + name + '!'); 
});

bot.onText(/\/gitignore (.+)/,  gitignoreController.getGitignore);

bot.onText(/\/login (.+)/,  userController.login);
bot.onText(/\/logout/,  userController.logout);
bot.onText(/\/getme/,  userController.getMe);

