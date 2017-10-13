const cfg = require('./env.js');
const puppeteer = require('puppeteer');

function pageUrl(page) {
	console.log('    <= ' + page.url());
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

	page.on('request', req => {
		console.log('  => ' + req.url);
		// console.log('');
	});

	page.on('load', e => {
		// screenshot(page);
	});

	page.on('framenavigated', frame => {
		if (frame == page.mainFrame()) {
			setTimeout(() => {
				console.log(frame.url());
				screenshot(page);
			}, 1500);
		}
	});

	page.on('response', rsp => {
		// screenshot(page);
		// console.log('  => ' + rsp.request().url);
		// console.log('');
	});

	await page.goto(cfg.baseUrl);

pageUrl(page);

	await page.evaluate(function() {
		document.querySelector('#login').focus();
		document.querySelector('input[name="username"]').value = 'personeel';
		document.querySelector('input[name="password"]').value = 'test';
	});

// await screenshot(page);

	await page.click('#login');

pageUrl(page);
// await screenshot(page);

	await page.goto(cfg.baseUrl + 'blockreservations');
pageUrl(page);




	// setTimeout(async x => await browser.close(), 1000);
})();
