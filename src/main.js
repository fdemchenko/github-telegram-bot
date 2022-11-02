const TelegramBot = require('node-telegram-bot-api');
const GitignoreController = require('./Controllers/GitignoreController');

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const bot = new TelegramBot(TG_BOT_TOKEN, { polling: true });

const gitignoreController = new GitignoreController(bot);

bot.onText(/\/gitignore (.+)/,  gitignoreController.getGitignore);
