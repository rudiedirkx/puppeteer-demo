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
	page.screenshot({path: name});
}

async function pageContent(page) {
	var html = await page.content();
	console.log(html);
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

	await page.evaluate(function() {
		document.querySelector('input[name="username"]').value = 'personeel';
		document.querySelector('input[name="password"]').value = 'test';
	});
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
	await page.waitFor(300);
	await screenshot(page);



	// await browser.close();
	setTimeout(async x => await browser.close(), 1000);
})();
