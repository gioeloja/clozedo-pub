const requestify = require('requestify')
const cheerio = require('cheerio')


function logIn(url, requestType, jwtCookie, uiCookie) {
    return requestify.request(url, {
        method: requestType,
        
        cookies: {
            jwt: jwtCookie,
            ui: uiCookie
        }
    })
}

async function getUser(jwt, ui) {
    //console.log('here is ' , jwt, ui)
    return logIn('https://poshmark.com/feed', 'GET', jwt, ui)
    .then(function(response) {


        const body = response.body
        const $ = cheerio.load(body);
        // console.log($)
        html = $.text()
        regex = /"dh":"([a-zA-Z0-9]+)",/
        let match = html.match(regex)

        console.log(match[1])
        return match[1]
        
    }) .catch(error => {
        console.log('got erry' + JSON.stringify(error))
        return null
    })
    
}

module.exports = {
	getUser: getUser
  };