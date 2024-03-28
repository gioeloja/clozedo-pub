// :)
const https = require('https')
const requestify = require('requestify')
const captchaSolver= require('./webkit.js')
const extracter = require('./extract_mongo.js')
require('dotenv').config();

let cookieJson;
(async () => {
  try {
    let user_settings = await extracter.extract('user_settings', process.env.APP_USER);
    user_settings = user_settings[0]
    if (user_settings && user_settings.userInfo && user_settings.userInfo.cookies) {
      // Extraction was successful, and the properties exist
      cookieJson = user_settings.userInfo.cookies;
    } else {
      console.error('Error: Unable to extract user settings or missing required properties.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();

function logIn(url, requestType, jwtCookie, uiCookie, offerInfo) {
  return requestify.request(url, {
      method: requestType,
      
      cookies: {
          jwt: jwtCookie,
          ui: uiCookie
      },
      body: offerInfo,

      dataType: 'json',
  })
}

 function updatePost(link, jwt, ui,  itemInfo, writer) {
  return logIn(link, 'PUT', cookieJson.jwt, cookieJson.ui)
  .then(async function(response) {
      const body = response.body

      if (body.includes('error') && body.includes('SuspectedBotError'))
      {
          console.log('captfch')

          await writer(process.env.APP_USER, "ATTEMPTING TO SOLVE CAPTCHA")


          try
          {
            let titleFix = itemInfo.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');
            let captchaLink = `https://poshmark.com/listing/${titleFix}-${itemInfo.id}`

            await captchaSolver.solveCaptcha(jwt, ui, captchaLink)

            await writer(process.env.APP_USER, "CAPTCHA SOLVED SUCCESSFULLY")

          }
          catch(error)
          {
            throw new Error("ERROR OCCURRED FOR CAPTCHA: " + error)
          }



      }
      else if (body.includes('error'))
      {
        throw new Error("Unknown error encountered while updating post:  " + body)
      }
      else
      {
        ///console.log('Successfully updated ' + itemInfo.title)
      }
      return response
      
  }) 
}



function getRandomNumber(min, max) {
  return Math.random() * (max - min + 1) + min ; // Convert seconds to milliseconds
}


function getRandomDelay(arg) {
  if (arg === 0) {
    return getRandomNumber(3, 4)  // 3-5 seconds
  } else if (arg === 1) {
    return getRandomNumber(5, 6)// 5-7 seconds
  } else if (arg === 2) {
    return getRandomNumber(7, 9) // 7-10 seconds
  } else {
    return getRandomNumber(5, 6) 
  }
}




async function delay(seconds) {
  console.log('delaying by', seconds*1000)
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function refreshAllUserItems(itemsDict, jwt, ui, speed, counter, writer)
{
  for(let i = 0; i < itemsDict.length; i++)
  {
 
    try {        
        let link = `https://poshmark.com/vm-rest/users/self/shared_posts/${itemsDict[i].id}?bulk_action=true&pm_version=252.0.0`
        await updatePost(link, jwt, ui, itemsDict[i], writer)
        
        counter(itemsDict[i].title)
        let del = getRandomDelay(speed)
        await delay(del)
    } catch (error) {
        console.log("FROM THE SCRIPT " + error)

    }
    
  }
  
}

module.exports = { refreshAllUserItems: refreshAllUserItems}
