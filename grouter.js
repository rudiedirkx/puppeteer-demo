const cfg = require('./env.js');
const fs = require('fs');
const puppeteer = require('puppeteer');

var screenshotIndex = 0;
function screenshot(page) {
	const name = 'x' + (++screenshotIndex) + '.png';
	console.log('[screenshot] ' + name);
	return page.screenshot({path: name});
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => resolve(true), ms);
	});
}

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setViewport({
		width: 400,
		height: 400,
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
		// console.log('[request] ' + req.url);
	});

	page.on('load', async () => {
		// console.log('[loaded] ' + page.url());
	});

	await page.goto(cfg.grouterUrl);
	await sleep(2000);
	await screenshot(page);

	// await browser.close();
	setTimeout(async x => await browser.close(), 1000);
})();
