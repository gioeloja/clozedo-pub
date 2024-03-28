const extracter = require('./extract_mongo.js')
const updater = require('./update_settings_mongo.js')
const logInner = require('./sales_page_parser.js')


async function validateCookies(user)
{
    const user_settings = await extracter.extract("user_settings", user)
    console.log(!user_settings[0].userInfo)
    if (!user_settings[0].userInfo.cookies) {
      updater.update_settings_mongo(user, "false", 'userInfo.cookieStatus')
      return "false";
    }

    const cookies = user_settings[0].userInfo.cookies
    console.log(user_settings)
    return logInner.logIn("https://poshmark.com/feed", 'GET', cookies.jwt, cookies.ui).then( function(response) {
        updater.update_settings_mongo(user, "true", 'userInfo.cookieStatus')
        return "true"
        
    }).catch( function(error) {
        updater.update_settings_mongo(user, "false", 'userInfo.cookieStatus')
        return "false";
      });
}




module.exports = {
	validateCookies: validateCookies
  };