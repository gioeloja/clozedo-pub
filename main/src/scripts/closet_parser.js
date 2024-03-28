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

async function getFirstPageInfo(link) {
	content = await fetch(link, fetchOptions);
	
	let htmlContent = await content.text();

	let scriptContent = htmlContent.match(/"data":\[{((.|\n)*)}],"more"/)[0];
	scriptContent = scriptContent.replace(/,"more"/, "");
	scriptContent = scriptContent.replace(/"data":/, "");

	scriptContent = JSON.parse(scriptContent);

	return { html: htmlContent, script: scriptContent };
}

async function parseSite(siteLink, next_id = null, doFirst = null, username, inventoryStatus) {
	let data_list = [];
	let fixedLink = siteLink;
	if (doFirst) {
		pageScrape = await getFirstPageInfo(
			"https://poshmark.com/closet/"+username + "?availability=" + inventoryStatus
		);
		let content = pageScrape["script"];
		let html = pageScrape["html"];

		for (let i = 0; i < content.length; i++) {
			const dateListedObj = new Date(content[i].first_published_at);

			const year_listed = dateListedObj.getFullYear();
			const month_listed = dateListedObj.getMonth() + 1; // Months are zero-indexed, so add 1 to get the correct month number (1-12).
			const str_month_listed = dateListedObj.toLocaleString('en-US', { month: 'short' }); // Get the short form of the month
			const day_listed = dateListedObj.getDate();
			const month_day_listed = `${month_listed}/${day_listed}`;
			const weekday_listed = dateListedObj.toLocaleString('en-US', { weekday: 'short' });
			const hour_listed = dateListedObj.getUTCHours();


			cleaned_dict = {
				picUrl:content[i].picture_url,
				id: content[i].id,
				title:content[i].title,
				status:content[i].inventory.status,
				size:content[i].size,
				brand:content[i].brand,
				date_listed: content[i].first_published_at,
				year_listed: year_listed,
				month_listed: month_listed,
				str_month_listed: str_month_listed,
				day_listed: day_listed,
				month_day_listed: month_day_listed,
				weekday_listed: weekday_listed,
				hour_listed: hour_listed,
				likes:content[i].like_count,
				price:content[i].price,
				gender:content[i].department.display,
				category:content[i].category_v2.display,
				size: content[i].inventory.size_quantities[0].size_id,

				
			};

			if(cleaned_dict["brand"] == "") {
				cleaned_dict["brand"] = "No brand"
			}

			if(cleaned_dict["status"] == "sold_out") {
				const dateSoldObj = new Date(content[i].inventory.status_changed_at);

				cleaned_dict["price_sold"] = content[i].price_amount.val,
				cleaned_dict["date_sold"] = content[i].inventory.status_changed_at,
				cleaned_dict["year_sold"] = dateSoldObj.getFullYear();
				cleaned_dict["month_sold"] = dateSoldObj.getMonth() + 1; // Months are zero-indexed, so add 1 to get the correct month number (1-12).
				cleaned_dict["str_month_sold"] = dateSoldObj.toLocaleString('en-US', { month: 'short' }); // Get the short form of the month
				cleaned_dict["day_sold"] = dateSoldObj.getDate();
				cleaned_dict["month_day_sold"] = `${cleaned_dict["month_sold"]}/${cleaned_dict["day_sold"]}`;
				cleaned_dict["weekday_sold"] = dateSoldObj.toLocaleString('en-US', { weekday: 'short' });
				cleaned_dict["hour_sold"] = dateSoldObj.getUTCHours();
			}


			data_list.push(cleaned_dict);
		}

		const match = html.match(`"next_max_id":(.*?)}`);
		fixedLink = fixedLink.replace(/TMPID/, match[1]);
	}
	const regex = /TMPID/;

	if (next_id) {
		fixedLink = fixedLink.replace(regex, next_id);
	}

	const response = await fetch(fixedLink, fetchOptions);
	const html = await response.text();

	content = JSON.parse(html).data;

	for (let i = 0; i < content.length; i++) {
		const dateListedObj = new Date(content[i].first_published_at);

		const year_listed = dateListedObj.getFullYear();
		const month_listed = dateListedObj.getMonth() + 1; // Months are zero-indexed, so add 1 to get the correct month number (1-12).
		const str_month_listed = dateListedObj.toLocaleString('en-US', { month: 'short' }); // Get the short form of the month
		const day_listed = dateListedObj.getDate();
		const month_day_listed = `${month_listed}/${day_listed}`;
		const weekday_listed = dateListedObj.toLocaleString('en-US', { weekday: 'short' });
		const hour_listed = dateListedObj.getUTCHours();

		cleaned_dict = {
			picUrl:content[i].picture_url,
			id: content[i].id,
			title:content[i].title,
			status:content[i].inventory.status,
			size:content[i].size,
			brand:content[i].brand,
			date_listed: content[i].first_published_at,
			year_listed: year_listed,
			month_listed: month_listed,
			str_month_listed: str_month_listed,
			day_listed: day_listed,
			month_day_listed: month_day_listed,
			weekday_listed: weekday_listed,
			hour_listed: hour_listed,
			likes:content[i].like_count,
			price:content[i].price,
			gender:content[i].department.display,
			category:content[i].category_v2.display
		};

		if(cleaned_dict["brand"] == "") {
			cleaned_dict["brand"] = "No brand"
		}

		if(cleaned_dict["status"] == "sold_out") {
			const dateSoldObj = new Date(content[i].inventory.status_changed_at);

			cleaned_dict["price_sold"] = content[i].price_amount.val,
			cleaned_dict["date_sold"] = content[i].inventory.status_changed_at,
			cleaned_dict["year_sold"] = dateSoldObj.getFullYear();
			cleaned_dict["month_sold"] = dateSoldObj.getMonth() + 1; // Months are zero-indexed, so add 1 to get the correct month number (1-12).
			cleaned_dict["str_month_sold"] = dateSoldObj.toLocaleString('en-US', { month: 'short' }); // Get the short form of the month
			cleaned_dict["day_sold"] = dateSoldObj.getDate();
			cleaned_dict["month_day_sold"] = `${cleaned_dict["month_sold"]}/${cleaned_dict["day_sold"]}`;
			cleaned_dict["weekday_sold"] = dateSoldObj.toLocaleString('en-US', { weekday: 'short' });
			cleaned_dict["hour_sold"] = dateSoldObj.getUTCHours();
		}

		data_list.push(cleaned_dict);
	}

	const match = html.match(`"next_max_id":(.*?)}`);

	if (match) {
		nextData = await parseSite(siteLink, match[1]);
		data_list.push(...nextData);
	} else {
		console.log("DONE");
	}

	return data_list;
}

async function getPoshmarkDict(username, inventoryStatus) {
	try {
		let link = `https://poshmark.com/vm-rest/users/` + username + `/posts/filtered?request={"filters":{"department":"All","inventory_status":["` + inventoryStatus + `"]},"experience":"all","max_id":TMPID,"count":48}&summarize=true&app_version=2.55&pm_version=234.0.0`;
		let res = await parseSite(link, null, (doFirst = true), username, inventoryStatus);
		return res;
	} catch (error) {
	console.log("Error retrieving closet listings:", error)
}
}

module.exports = {
	getPoshmarkDict: getPoshmarkDict,
};
