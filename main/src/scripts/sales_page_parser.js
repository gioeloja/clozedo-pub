const requestify = require('requestify')
const cheerio = require('cheerio')
const { request } = require('http')
const linkStart = `https://poshmark.com/vm-rest/users/TMPID/orders/sales?request=`
const linkStartWithID = "https://poshmark.com/vm-rest/users/TMPID/orders/sales?request=%7B%22max_id%22:%22TMPMAXID%22,%22filters%22:%7B%7D%7D&pm_version=234.0.0"

const fetchOptions = {
	headers: {
	  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
	  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
	  'Accept-Language': 'en-US,en;q=0.5',
	  'Accept-Encoding': 'gzip, deflate, br',
	  //'Connection': 'keep-alive',
	  // Add any other required headers
	},
  };


function logIn(url, requestType, jwtCookie, uiCookie) {
    return requestify.request(url, {
        method: requestType,
        cookies: {
            jwt: jwtCookie,
            ui: uiCookie
        },
		headers: fetchOptions
    })
}


function getUserID(username) {
	
    return logIn('https://poshmark.com/closet/'+username, 'GET').then(function(response) {
        const body = response.body
        const $ = cheerio.load(body);
        let pattern = /data-et-prop-lister_id="([a-zA-Z0-9]+)"/;
        let match = pattern.exec(body);

        //let id_pattern = /{"id":"(.+)"/
        //let id_match = id_pattern.exec(body)
        if (match) {
            return match[1]
        } else {
			console.log(body)
          return null;
        }
        
    }) 
}

async function scrapeBundlePage(link, numberItems, jwtCookie, uiCookie) {
	return logIn(link, 'GET', jwtCookie, uiCookie)
	.then(async function(response) {
		const body = response.body
		let scriptContent = body.match(/\$_order_details":(.+)},"meta":/)[0];
		scriptContent = scriptContent.replace(/\$_order_details":{"order":/, "");
		scriptContent = scriptContent.replace(/,"meta":/, "");
		
		scriptContent = JSON.parse(scriptContent);

		// This array will contain the new clean dictionaries. This array will be returned.
		let dictArray = []

		for(let i=0;i<numberItems;i++) {
			let date_sold = scriptContent.inventory_booked_at.substring(0, scriptContent.inventory_booked_at.indexOf('T'));
			let [year_sold, month_sold] = date_sold.split('-').slice(0, 2);
			let cleaned_dict = 
			{
				picUrl:scriptContent.line_items[i].picture_url,
				title:scriptContent.line_items[i].title,
				is_bundle:scriptContent.is_bundle,
				state:scriptContent.state,
				display_status:scriptContent.display_status,
				bundle_size:numberItems,
				bundle_original_price: scriptContent.total_original_price_amount.val,
				bundle_sold_price: scriptContent.total_price_amount.val,
				item_original_price:scriptContent.line_items[i].price_amount.val,
				price_sold:(scriptContent.line_items[i].price_amount.val / scriptContent.total_original_price_amount.val) * scriptContent.total_price_amount.val,
				date_sold: scriptContent.inventory_booked_at,
				month_sold: month_sold,
				year_sold: year_sold
			}
				dictArray.push(cleaned_dict)
		}

		return dictArray
	})
}

async function scrapeCancelledBundlePage(link, numberItems, jwtCookie, uiCookie) {
	return logIn(link, 'GET', jwtCookie, uiCookie)
	.then(async function(response) {
		const body = response.body
		let scriptContent = body.match(/\$_order_details":(.+)},"meta":/)[0];
		scriptContent = scriptContent.replace(/\$_order_details":{"order":/, "");
		scriptContent = scriptContent.replace(/,"meta":/, "");
		
		scriptContent = JSON.parse(scriptContent);

		// This array will contain the new clean dictionaries. This array will be returned.
		let dictArray = []

		for(let i=0;i<numberItems;i++) {
			let cleaned_dict = 
			{
				picUrl:scriptContent.line_items[i].picture_url,
				state:scriptContent.state,
				display_status:scriptContent.display_status,
			}
				dictArray.push(cleaned_dict)
		}

		return dictArray
	})
}

function getSalesPageInfo(link, jwtCookie, uiCookie) {
    return logIn(link, 'GET', jwtCookie, uiCookie)
    .then(function(response) {
        const body = response.body
        const $ = cheerio.load(body).text();
		return $
        
    }) 
}

async function parseSite(next_id=null, username, jwtCookie, uiCookie, dataVersion)
{	
	let fixedLink = ""
	const userID = await getUserID(username)

	let data_list = [];
	
	const currentTimestamp = Math.floor(Date.now() / 1000);
	const requestJson = createJson(max_id = next_id, dataVersion, currentTimestamp);
	fixedLink = linkStart.replace('TMPID', userID) + encodeURIComponent(JSON.stringify(requestJson))

	const html = await getSalesPageInfo(fixedLink, jwtCookie, uiCookie)
	let content = JSON.parse(html).data.sales_summary;
	
	for(let i = 0; i < content.length; i++)
	{
		if(!content[i].is_bundle) {
			let date_sold = content[i].inventory_booked_at.substring(0, content[i].inventory_booked_at.indexOf('T'));
			let [year_sold, month_sold] = date_sold.split('-').slice(0, 2);
			
			let cleaned_dict = 
			{
				picUrl:content[i].picture_url,
				title:content[i].title,
				is_bundle:content[i].is_bundle,
				state:content[i].state,
				display_status:content[i].display_status,
				bundle_size:content[i].bundle_size,
				price_sold:content[i].total_price_amount.val,
				date_sold: content[i].inventory_booked_at,
				month_sold: month_sold,
				year_sold: year_sold
			}
			
			data_list.push(cleaned_dict)
		}

		if(content[i].is_bundle) {
			// debundledItems is an array of the cleaned_dicts of the items in the bundle
			let debundledItems = await scrapeBundlePage("https://poshmark.com/order/sales/" + content[i].id, content[i].bundle_size,  jwtCookie, uiCookie)
			for(let i=0;i< debundledItems.length ;i++) {
				data_list.push(debundledItems[i])
			}
		}
	}


	const match = html.match(`"next_max_id":"(.*?)\"`);
	
	if(match && match[1] != "")

	{
		let nextData = await parseSite(match[1], username, jwtCookie, uiCookie, dataVersion)
		
		data_list.push(...nextData)
	}
	return data_list

}

async function parseCancelledSite(next_id=null, username, jwtCookie, uiCookie, dataVersion)
{	
	

	let fixedLink = ""

	const userID = await getUserID(username)

	
	let data_list = [];
	
	const currentTimestamp = Math.floor(Date.now() / 1000);
	const requestJson = createJson(max_id = next_id, dataVersion, currentTimestamp, bundle = false, cancelled = true);
	fixedLink = linkStart.replace('TMPID', userID) + encodeURIComponent(JSON.stringify(requestJson))
	const html = await getSalesPageInfo(fixedLink, jwtCookie, uiCookie)
	
	let content = JSON.parse(html).data.sales_summary;
			
	
	for(let i = 0; i < content.length; i++)
	{

		if(!content[i].is_bundle) {	
			let cleaned_dict = 
			{
				picUrl:content[i].picture_url,
				title:content[i].title,
				state:content[i].state,
				display_status:content[i].display_status,
			}
			
			data_list.push(cleaned_dict)
		}

		if(content[i].is_bundle) {
			// debundledItems is an array of the cleaned_dicts of the items in the bundle
			let debundledItems = await scrapeCancelledBundlePage("https://poshmark.com/order/sales/" + content[i].id, content[i].bundle_size,  jwtCookie, uiCookie)
			for(let i=0;i< debundledItems.length ;i++) {
				data_list.push(debundledItems[i])
			}
		}
	}


	const match = html.match(`"next_max_id":"(.*?)\"`);
	if(match && match[1] != "")

	{
		let nextData = await parseCancelledSite(match[1], username, jwtCookie, uiCookie, dataVersion)
		
		data_list.push(...nextData)
	}
	else
	{
	}
	return data_list

}

function convertUnixToCustomFormat(unixTimestamp) {
	const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
  
	return `${year}-${month}-${day}T00:00:00-00:00`;
}

function createJson(max_id, start_date, end_date, bundle = false, cancelled = false) {
	const json = {
	  "filters": {
		"bought_date": {
		  "start": convertUnixToCustomFormat(start_date),
		  "end": convertUnixToCustomFormat(end_date)
		}
	  },
	  
	};
	
	if(cancelled) {
		json["filters"]["status"] = ["cancelled"]
	}

	if(bundle) {
		json["query"] = "bundle"
	}
  
	if (max_id !== null) {
	  json["max_id"] = max_id.toString();
	}
	return json;
  }

async function getPoshmarkDict(username, jwtCookie, uiCookie, dataVersion)

{
	try {
		let bundleRes = await parseSite(null, username, jwtCookie, uiCookie, dataVersion)
		let cancelledRes = await parseCancelledSite(null, username, jwtCookie, uiCookie, dataVersion)
		return bundleRes.concat(cancelledRes)
	} catch (error) {
		console.log("Error retrieving sales data:", error)
	}
	
}





module.exports = {
	getPoshmarkDict: getPoshmarkDict,
	logIn: logIn
  };

//getJsonFromSite();
