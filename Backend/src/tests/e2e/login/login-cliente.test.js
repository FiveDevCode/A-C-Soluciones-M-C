require('chromedriver');

import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

jest.setTimeout(120000);

describe('LOGIN CLIENTE - E2E', () => {
    let driver;

    beforeAll(async () => {
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');

        
        const service = new chrome.ServiceBuilder(require('chromedriver').path);

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)// ESTA ES LA CORRECTA PARA v4
            .build();

        await driver.manage().setTimeouts({ implicit: 20000 });
    });

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    test('debe loguearse correctamente y redireccionar al dashboard cliente', async () => {

        const loginUrl = 'http://localhost:5173/iniciar-sesion';

        const testEmail = 'jonier.urrea@correounivalle.edu.co';
        const testPassword = 'Jonier12@';

        await driver.get(loginUrl);

        const inputCorreo = await driver.wait(
            until.elementLocated(By.css('[data-testid="correo"] input')),
            15000
        );

        const inputPassword = await driver.wait(
            until.elementLocated(By.css('[data-testid="password"] input')),
            15000
        );

        const btnLogin = await driver.wait(
            until.elementLocated(By.css('[data-testid="login-btn"]')),
            15000
        );

        await inputCorreo.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await inputCorreo.sendKeys(testEmail);

        await inputPassword.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await inputPassword.sendKeys(testPassword);


        await btnLogin.click();

        await driver.wait(until.urlContains('/cliente/inicio'), 20000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/cliente/inicio');
    });
});
