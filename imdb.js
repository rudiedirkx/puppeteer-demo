const cfg = require('./env.js');
// const readline = require('readline');
const fs = require('fs');
const puppeteer = require('puppeteer');

// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// });

var screenshotIndex = 0;
function screenshot(page) {
	return new Promise(resolve => {
		setTimeout(function() {
			const name = 'x' + (++screenshotIndex) + '.png';
			console.log('[screenshot] ' + name);
			resolve(page.screenshot({path: name}));
		}, 500);
	});
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

	await page.goto('https://www.imdb.com/registration/signin');
	await screenshot(page);

	await page.click('.auth-sprite.imdb-logo');
	await page.waitForNavigation();
	await screenshot(page);

	await sleep(1100);

	await page.type('#ap_email', cfg.imdbUser);
	await page.type('#ap_password', cfg.imdbPass);
	await screenshot(page);

	await sleep(2100);

	await page.click('#signInSubmit');
	await page.waitForNavigation();
	await screenshot(page);

	// rl.question('> Enter the code: ', async answer => {
	// 	rl.close();
	// 	console.log(answer);
	// 	await page.type('#ap_email', cfg.imdbUser);
	// 	await page.type('#ap_password', cfg.imdbPass);
	// 	await page.click('#signInSubmit');
	// });

	// await browser.close();
	setTimeout(async x => await browser.close(), 3000);
})().then(() => console.log('end'));
