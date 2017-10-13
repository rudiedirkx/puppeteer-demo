const cfg = require('./env.js');
const puppeteer = require('puppeteer');

function pageUrl(page) {
	console.log('    <= ' + page.url());
	console.log('');
}

async function screenshot(page, name) {
	page.screenshot({path: 'x-' + name + '.png'});
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
		console.log('');
	});

	// page.on('response', rsp => {
	// 	console.log('  => ' + rsp.request().url);
	// 	console.log('');
	// });

	await page.goto(cfg.baseUrl);
	pageUrl(page);

	await page.evaluate(function() {
		document.querySelector('#login').focus();
	});
// 	var el = await page.$('#login');
// console.log(el);
// 	await el.focus();
await screenshot(page, 'pre-login-1');

	await page.type('input[name="username"]', 'personeel', {delay: 100});
	await page.type('input[name="password"]', 'test', {delay: 100});
await screenshot(page, 'pre-login-2');
	await page.click('#login');
pageUrl(page);
await screenshot(page, 'login');

	await page.goto(cfg.baseUrl + 'blockreservations');
pageUrl(page);
// await pageContent(page);
await screenshot(page, 'blockreservations');




	setTimeout(async x => await browser.close(), 500);
})();
