const requestify = require('requestify')
const cheerio = require('cheerio')
const linkStart = `https://poshmark.com/vm-rest/users/TMPID/newsfeed/like?&pm_version=238.0.0`
const linkStartWithID = "https://poshmark.com/vm-rest/users/TMPID/orders/sales?request=%7B%22max_id%22:%22TMPMAXID%22,%22filters%22:%7B%7D%7D&pm_version=234.0.0"
var userID = ""

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


function getUserID(username) {
    return logIn('https://poshmark.com/closet/'+username, 'GET')
    .then(function(response) {
        try {
          const body = response.body
          const $ = cheerio.load(body);

          let pattern = /data-et-prop-lister_id="([a-zA-Z0-9]+)"/;
          let match = pattern.exec(body);

          if (match) {
              return match[1]
          } else {
            return null;
          }
      }
      catch (error) {
        console.log("Ran into error with getting user ID, ", error)
      }
    }) 
}

async function scrapeLikesPage(link, jwtCookie, uiCookie) {
	return logIn(link, 'GET', jwtCookie, uiCookie)
	.then(async function(response) {
		const body = response.body
        return body

    })
}

async function checkForLikes(username, jwtCookie, uiCookie, offerInterval, offerClockStartTime)
{
    let userID = await getUserID(username)
    let res = []
    let likesPageJSON = {}
    try
    {
        let fixedLink = linkStart.replace(/TMPID/, userID);
        console.log(fixedLink)
        likesPageHTML = await scrapeLikesPage(fixedLink, jwtCookie, uiCookie)   
        likesPageJSON = JSON.parse(likesPageHTML).data
    }
    catch(error)
    {
        console.log("Caught error: " + error)
    }

    if(likesPageJSON)
    {
        try
        {
            for(let i = 0; i < likesPageJSON.length; i++)
            {
                if(likesPageJSON[i].story_type == "PersonLikePost") {
                    const now = new Date()
                    const timeOfLike = new Date(likesPageJSON[i].content.data[0]["news_item"]["created_at"])
                    const minuteDifference = Math.abs(now.getTime() - timeOfLike.getTime()) / (1000 * 60)
                    if(minuteDifference >= offerInterval && offerClockStartTime < timeOfLike.getTime()) {
                        const itemDict = {
                            title: likesPageJSON[i].content.data[0]["news_item"]["content"]["data"][0]["content"],
                            link: likesPageJSON[i].content.data[0]["news_item"]["target"]["url"]
                        }
                        res.push(itemDict)
                    }
                }
            }
        }
        catch(error)
        {
            console.log(error)
        }
        return res
    }
    else
    {
        return 0
    }
}

async function getItemPriceAndId(linkList)
{
  let itemDict = []
      for(const link of linkList)
      {
        console.log(`https://poshmark.com${link.link}`)
        let pageInfo = await fetch(`https://poshmark.com${link.link}`, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
        }})
        .then(response => response.text())
        .then(html => {
          const $ = cheerio.load(html)
          const price = $('p.h1').text().trim().replace('$', '');
          const id=  $('a[data-et-prop-listing_id]').attr('data-et-prop-listing_id');
          itemDict.push({price: price, id: id})
        })
      }
      console.log(itemDict)
      return itemDict
  }


function sendOffer(link, jwt, ui, offerInfo) {
    return logIn(link, 'POST',  jwt, ui, offerInfo)
    .then(async function(response) {
        console.log('MAKING POST TO' + link)
        const body = response.body
  
        if (body.includes('error') && body.includes('SuspectedBotError'))
        {
            console.log('captfch')
  
            let titleFix = itemInfo.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');
            let captchaLink = `https://poshmark.com/listing/${titleFix}-${itemInfo.id}`
            console.log('link', captchaLink)
  
            await captchaSolver.solveCaptcha(jwt, ui, captchaLink)
        }
        else if (body.includes('error'))
        {
          throw new Error("Unknown error encountered while updating post:  " + body)
        }
        else
        {
          console.log('Successfully updated ' + itemInfo.title)
        }
        return response
        
    }) 
  }



async function sendOffersOnItems(itemsInfo, jwt, ui, percentage, shippingNum, priceMin, basedOff, writer)
{
  for(let i = 0; i < itemsInfo.length; i++)
  {
    let offerPrice = itemsInfo[i].price 
    let discount = offerPrice * (percentage * .01)
    let discountedPrice = Math.floor(offerPrice - discount)
    console.log(discountedPrice)

    if(discountedPrice > (offerPrice - offerPrice*.10))
    {
      console.log(`wrong numbers for link ${link}, offer: ${offerPrice} disc: ${discountedPrice}`)
      return 0
    }

    let update_link = `https://poshmark.com/vm-rest/posts/${itemsInfo[i].id}/likes/users/offers?pm_version=254.0.0`
    if(basedOff == 1) // check for price being more than set price minimum 
    {

      if(discountedPrice < priceMin)
      {
        console.log(`dc price ${discountedPrice} is less than pm ${priceMin}`)
        continue
      }
      else
      {
        let offerInfo = {
          offer_amount: { val: discountedPrice, currency_code: "USD" },
          seller_shipping_discount: { id: `5ff7647a5d29bbebfa25f9d${shippingNum+1}` },
          offer_api_version: 3,
        };
        
        try {
          sendOffer(update_link, jwt, ui, offerInfo)
        }
        catch (error) {
          console.log(error)
        }

        
      }
    }

    else
    {
      let shippingDiscount = 0
      switch(shippingNum)
      {
        case 0:
          shippingDiscount = 2.02
          break

        case 1:
          shippingDiscount = 2.98
          break

        case 2:
          shippingDiscount= 7.97
          break

        default:
          shippingDiscount = 2.02
      }


      let userEarnings = discountedPrice * 0.8 - shippingDiscount

      console.log(`UE: ${userEarnings} DP ${discountedPrice} OP ${offerPrice}`)


      if(userEarnings < priceMin)
      {
        continue
      }
      else
      {
        let offerInfo = {
          offer_amount: { val: discountedPrice, currency_code: "USD" },
          seller_shipping_discount: { id: `5ff7647a5d29bbebfa25f9d${shippingNum+1}` },
          offer_api_version: 3,
        };
        try {
          sendOffer(update_link, jwt, ui, offerInfo)
        }
        catch (error) {
          console.log(error)
        }
      }
    }
     let del = Math.random() * (2) 
     await delay(del)
    
  }
  
}

async function delay(seconds) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

module.exports = {checkForLikes: checkForLikes, getItemPriceAndId: getItemPriceAndId, sendOffersOnItems: sendOffersOnItems}