const cfg = require('./env.js');
const fs = require('fs');
const puppeteer = require('puppeteer');

function pageUrl(page) {
	console.log(' => ' + page.url());
	// console.log('');
}

var screenshotIndex = 0;
async function screenshot(page) {
	const name = 'x' + (++screenshotIndex) + '.png';
	console.log(name);
	await page.screenshot({path: name});
}

async function pageContent(page) {
	var html = await page.content();
	console.log(html);
}

async function waitForAjax(page, async) {
	if (async) {
		await page.waitForSelector('#ajax_loading', {visible: true});
	}
	await page.waitForSelector('#ajax_loading', {hidden: true});
}

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setViewport({
		width: 1400,
		height: 800,
	});

	try {
		for (var i = 1; i < 99; i++) {
			var name = `x${i}.png`;
			fs.unlinkSync(name);
			console.log('deleted', name);
		}
	}
	catch (ex) {}

	page.on('request', req => {
		console.log('[request] ' + req.url);
	});

	page.on('load', async () => {
		console.log('[load] ' + page.url());
		// await screenshot(page);
	});

	// page.on('framenavigated', frame => {
	// 	if (frame == page.mainFrame()) {
	// 		setTimeout(() => {
	// 			console.log(frame.url());
	// 			screenshot(page);
	// 		}, 100);
	// 	}
	// });

	// page.on('response', rsp => {
	// 	// screenshot(page);
	// 	// console.log('  => ' + rsp.request().url);
	// 	// console.log('');
	// });

	await page.goto(cfg.baseUrl);
	await screenshot(page);

	await page.type('input[name="username"]', 'personeel');
	await page.type('input[name="password"]', 'test');
	await screenshot(page);

	await page.click('#login');
	await page.waitForNavigation();
	await screenshot(page);

	await page.goto(cfg.baseUrl + 'blockreservations');
	await screenshot(page);

	var el = await page.$('a[href="/blockreservations/new"]');
	await page.evaluate(el => el.click(), el);
	await page.waitForNavigation();
	await screenshot(page);

	await page.select('[name="resource_id"]', '25');
	await page.select('[name="on_day"]', '2');
	await page.waitForSelector('#ajax_loading', {hidden: true});
	await screenshot(page);

	await page.select('[name="start_time"]', '20:00');
	await page.select('[name="end_time"]', '21:00');
	await waitForAjax(page, false);
	await screenshot(page);

	await page.type('#pplayer1 .ms-txt', 'gree');
	await waitForAjax(page, true);
	await screenshot(page);

	await page.type('#pplayer2 .ms-txt', 'geer');
	await waitForAjax(page, true);
	await screenshot(page);

	await page.click('.button.submit');
	await page.waitForSelector('#overlays form .button.submit')
	await screenshot(page);



	// await browser.close();
	setTimeout(async x => await browser.close(), 3000);
})();
