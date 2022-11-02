const { User } = require('../models');

const isAuthorized = async (userId) => {
  try {
    const user = await User.findOne({ where: { tg_user_id: userId } });

    if (user !== null) {
      return user['gh_username'];
    } else {
      return null;
    }

  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = isAuthorized;
