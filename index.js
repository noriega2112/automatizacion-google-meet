const puppeteer = require('puppeteer');

require('dotenv').config();

const loginAndJoin = async (roomUrl = '') => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const context = browser.defaultBrowserContext();
  context.overridePermissions('https://meet.google.com', [
    'camera',
    'microphone',
  ]);

  const loginPage = await browser.newPage();

  const navigationPromise = loginPage.waitForNavigation();

  await loginPage.goto('https://accounts.google.com/');

  await navigationPromise;

  await loginPage.waitForSelector('input[type="email"]');
  await loginPage.click('input[type="email"]');

  await navigationPromise;

  await loginPage.type('input[type="email"]', process.env.EMAIL);

  await loginPage.waitForSelector('#identifierNext');
  await loginPage.click('#identifierNext');

  await loginPage.waitForTimeout(500);

  await loginPage.waitForSelector('input[type="password"]');
  await loginPage.click('input[type="email"]');
  await loginPage.waitForTimeout(500);

  await loginPage.type('input[type="password"]', process.env.PASSWD);

  await loginPage.waitForSelector('#passwordNext');
  await loginPage.click('#passwordNext');

  await navigationPromise;
  await loginPage.waitForTimeout(1000);

  loginPage.close();

  const pages = await browser.pages();
  pages[0].close();

  const roomPage = await browser.newPage();

  await roomPage.goto(roomUrl);

  roomPage.waitForXPath(
    '/html/body/div[1]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[2]/div/div[2]/div/div[1]/div[1]'
  );

  const silenceBtn = await roomPage.$x(
    '/html/body/div[1]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[1]/div[1]/div/div[4]/div[1]/div/div/div'
  );
  await silenceBtn[0].click();

  const cameraBtn = await roomPage.$x(
    '/html/body/div[1]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[1]/div[1]/div/div[4]/div[2]/div/div'
  );
  await cameraBtn[0].click();

  const joinBtn = await roomPage.$x(
    '/html/body/div[1]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[2]/div/div[2]/div/div[1]/div[1]'
  );
  setTimeout(async () => {
    await joinBtn[0].click();
  }, 5000);
};

console.log('----------------------INICIANDO APLICACION----------------------');

let lastClass = null;
loginAndJoin('https://meet.google.com/sdi-acdn-ksu');
setInterval(() => {
  const now = new Date();
  const currentTime = `${now.getHours()}:${
    now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  }`;
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const currentDay = now.getDay();

  console.clear();
  console.log(
    '----------------------HORA ACTUAL: ' +
      currentTime +
      '----------------------'
  );
  //Analisis 2
  if (
    (currentDay === 1 || currentDay === 3) &&
    hour === 19 &&
    minutes >= 45 &&
    minutes <= 50 &&
    lastClass !== 'analisis'
  ) {
    lastClass = 'analisis';
    loginAndJoin('https://meet.google.com/sdi-acdn-ksu');
  }
  if (currentDay === 2 || currentDay === 4) {
    //Fisica 3
    if (
      hour === 18 &&
      minutes >= 00 &&
      minutes <= 10 &&
      lastClass !== 'fisica'
    ) {
      lastClass = 'fisica';
      loginAndJoin('https://meet.google.com/zcp-oanb-cwf');
    }
    //Logica
    if (
      hour === 19 &&
      minutes >= 45 &&
      minutes <= 50 &&
      lastClass !== 'logica'
    ) {
      lastClass = 'logica';
      loginAndJoin('https://meet.google.com/vjq-suex-yqz');
    }
  }
  //Laboratorio
  if (
    currentDay === 5 &&
    hour === 18 &&
    minutes >= 00 &&
    minutes <= 10 &&
    lastClass !== 'lab'
  ) {
    lastClass = 'lab';
    loginAndJoin('https://meet.google.com/nzj-caph-hij');
  }
  //Comercio
  if (
    currentDay === 6 &&
    hour === 14 &&
    minutes >= 25 &&
    minutes <= 30 &&
    lastClass !== 'comercio'
  ) {
    lastClass = 'comercio';
    loginAndJoin('https://meet.google.com/kub-dpqf-tdd');
  }
}, 60000);
