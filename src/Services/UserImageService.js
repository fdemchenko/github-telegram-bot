const octokit = require('../octokit');
const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');
const { restrictions } = require('../../botConfig');

module.exports = class UserImageService {
  static async getUserInfo(githubUsername) {
    const userResponce = await octokit.request('GET /users/{username}', {
      username: githubUsername
    });
    
    return userResponce.data;
  }

  static async generateUserImage(githubUsername) {
    const userData = await UserImageService.getUserInfo(githubUsername);

    const minFontSize = 30, maxFontSize = 65;
    const maxUsernameLength = restrictions.maxGithubUsernameLen;

    const width = 700;
    const height = 400;
    const canvas = createCanvas(width, height);

    const context = canvas.getContext('2d');
    const fontSize = userData.login.length * (minFontSize - maxFontSize) / (maxUsernameLength - 1) + 
      (maxFontSize * maxUsernameLength - minFontSize) / (maxUsernameLength - 1);

    context.fillStyle = '#E3ECEB';
    context.fillRect(0, 0, width, height);
    context.font = `${fontSize}px "DejaVu Sans Mono"`;
    context.fillStyle = '#000000';
    context.fillText(userData.login, 30, 360);

    context.font = '35px "DejaVu Sans Mono"';
    context.fillText(`${userData.followers !== 1 ? userData.followers + ' followers' : '1 follower'}`, 310, 120);
    context.fillText(`${userData.following} following`, 310, 170);
    context.font = `30px "DejaVu Sans Mono"`;
    context.fillText(`Public repos: ${userData.public_repos}`, 310, 240);

    const profileAvatar = await loadImage(userData.avatar_url);
    context.drawImage(profileAvatar, 30, 30, 250, 250);
    
    return canvas.toBuffer('image/jpeg');
  }
};
