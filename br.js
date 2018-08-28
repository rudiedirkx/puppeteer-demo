const cfg = require('./env.js');
const fs = require('fs');
const puppeteer = require('puppeteer');

var screenshotIndex = 0;
function screenshot(page) {
	const name = 'x' + (++screenshotIndex) + '.png';
	console.log('[screenshot] ' + name);
	return page.screenshot({path: name});
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
		console.log('[loaded] ' + page.url());
	});

	await page.goto(cfg.brBaseUrl);
	await screenshot(page);

	await page.type('input[name="username"]', 'personeel');
	await page.type('input[name="password"]', 'test');
	await screenshot(page);

	await page.click('#login');
	await page.waitForNavigation();
	await screenshot(page);

	await page.goto(cfg.brBaseUrl + 'blockreservations');
	await screenshot(page);

	await page.click('button.menu-toggler-label');
	await screenshot(page);

	await page.click('a[href="/blockreservations/new"]');
	await page.waitForNavigation();
	await screenshot(page);

	await page.select('[name="resource_id"]', '25');
	await page.select('[name="on_day"]', '2');
	await waitForAjax(page, false);
	await screenshot(page);

	await page.select('[name="start_time"]', '10:30');
	await page.select('[name="end_time"]', '11:30');
	await waitForAjax(page, false);
	await screenshot(page);

	await page.type('#pplayer1 .ms-txt', 'gree');
	// await screenshot(page);
	await waitForAjax(page, true);
	await screenshot(page);

	await page.type('#pplayer2 .ms-txt', 'geer');
	// await screenshot(page);
	await waitForAjax(page, true);
	await screenshot(page);

	await page.click('.button.submit');
	await page.waitForSelector('#overlays form .button.submit')
	await screenshot(page);



	// await browser.close();
	setTimeout(async x => await browser.close(), 3000);
})();
