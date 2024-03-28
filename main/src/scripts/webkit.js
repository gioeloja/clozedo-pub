const { webkit } = require('playwright-extra');


const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
RecaptchaPlugin()._isPuppeteerExtraPlugin = true;
require('dotenv').config();

webkit.use(RecaptchaPlugin({
  provider: {
      id: '2captcha',
      token: process.env.RECAPTCHA_TOKEN,
  },
  visualFeedback: true,
  solveInactiveChallenges: true,
}))
// webkit.use(stealth)



const solveCaptcha = async (jwt, ui, link) => {

  const browser = await webkit.launch({headless: true});
  

  try {
    
    // Launch the WebKit browser in headless mode

    // Create a new browser context
    const context = await browser.newContext();
  
    // Create a new page
    const page = await context.newPage();
    
    // Go to a website
    await page.goto(link, { waitUntil: 'domcontentloaded' })

    
  
  
  
    // Set cookies
    await page.context().addCookies([
      { name: 'jwt', value: jwt, domain: 'poshmark.com', path: '/' },
      { name: 'ui', value: ui, domain: 'poshmark.com', path: '/'  }
    ]);
  
    // Reload the page
    await page.reload();
  
    //await page.waitForTimeout(20000);
  
    // Print the HTML
  
  

    try {
      await page.waitForSelector(`[class="user-image user-image--s"]`, {timeout: 5000})
    } catch (error) {
      throw new Error({cookiesExpired: "Unable to login, cookies may be expired."})
    }
   
  
  
    await page.waitForTimeout(1000);

    await page.reload()


    async function waitForElementVisible(clickButtonSelector, targetElementSelector, maxAttempts = 10) {
    
      try {
        let attempts = 0;
    
        while (attempts < maxAttempts) {
          await page.waitForSelector(clickButtonSelector, { state: 'visible' });
          await page.click(clickButtonSelector);
          await page.waitForTimeout(1500);
    
          const targetElement = await page.waitForSelector(targetElementSelector, { state: 'visible', timeout: 0 });
    
          if (targetElement) {
            console.log('Target element is now visible.');
            targetElement.click()
            break;
          }
    
          attempts++;
          console.log(`Attempt ${attempts} - Target element is not visible yet.`);
        }
    
        if (attempts === maxAttempts) {
          throw new Error('Target element is still not visible after maximum attempts.');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }

    }


    await waitForElementVisible('[data-et-name="share"]', '[class="share-wrapper__share-title caption"]')
  
    // await page.click('[data-et-name="share"]')

    // await page.waitForSelector('[class="share-wrapper__share-title caption"]')
    // await page.click('[class="share-wrapper__share-title caption"]')



    let counter  = 0
    await waitForElementToDisappear(page, ".btn.btn--tertiary.m--r--4")


    async function waitForElementToDisappear(page, selector) {

      counter += 1
      const isElementVisible = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element && element.offsetWidth > 0 && element.offsetHeight > 0;
      }, selector);

      const captchaElement = await page.waitForSelector('.g-recaptcha');
  
      if (captchaElement) {
        // Solve captcha using 2captcha
        console.log("ATTEMPTING TO SOLVE CAPTCHA")
        const token = await page.solveRecaptchas();
        // const response = await solver.getResponse(token);
        // await page.evaluate(`document.getElementById('g-recaptcha-response').innerHTML = '${response}';`);
        // await page.evaluate(`document.querySelector('form').submit();`);
        console.log("CAPTCHA SOLVED")
        
        captchaSolved = true;

        await page.waitForTimeout(1500)
        return

      }
    
      if(counter > 10)
      {
        console.log("COULDN'T FIND THE CAPTCHA TO SOLVE AND TIMED OUT")
        await browser.close()
        throw new Error("Couldn't find CAPTCHA before timeout.")
      }
    
      await page.waitForTimeout(1000); // wait for 1 second before checking again
      await waitForElementToDisappear(page, selector); // recursive call
    }





  
    // Close the browser
    await browser.close();
    return
  } catch (error) {
    console.log('error', error)
    await browser.close()
    throw new Error(error)
  }
}

module.exports = { solveCaptcha: solveCaptcha}

