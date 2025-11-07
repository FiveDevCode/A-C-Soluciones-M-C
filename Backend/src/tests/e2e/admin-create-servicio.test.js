// tests/e2e/admin-create-servicio.test.js
require('chromedriver');

import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

jest.setTimeout(120000);

describe('ADMIN - CREAR SERVICIO - E2E', () => {
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
            .setChromeService(service)
            .build();

        await driver.manage().setTimeouts({ implicit: 20000 });
    });

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    test('admin debe poder crear un servicio correctamente', async () => {

        const loginUrl = 'http://localhost:5173/iniciar-sesion';

        const adminEmail = 'jonier145@gmail.com'; 
        const adminPassword = 'Jonier25@'; 

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
        await inputCorreo.sendKeys(adminEmail);

        await inputPassword.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
        await inputPassword.sendKeys(adminPassword);

        await btnLogin.click();

        await driver.wait(until.urlContains('/admin/inicio'), 20000);

        // CLICK CREA NUEVO SERVICIO
        const btnNuevoServicio = await driver.wait(
            until.elementLocated(By.css('[data-testid="btn-nuevo-servicio"]')),
            15000
        );

        await btnNuevoServicio.click();
        await driver.wait(until.urlContains('/admin/registrar-servicio'), 20000);

        // FORMUALRIO CREAR SERVICIO
        const nombreRandom = 'ServicioTest-' + Date.now();

        const nombreInput = await driver.wait(
            until.elementLocated(By.css('[data-testid="input-nombre-servicio"] input')),
            15000
        );

        const descInput = await driver.wait(
            until.elementLocated(By.css('[data-testid="input-descripcion-servicio"] textarea')),
            15000
        );

        await nombreInput.sendKeys(nombreRandom);
        await descInput.sendKeys("Servicio de pruebas generado por selenium");

        const btnSubmit = await driver.wait(
            until.elementLocated(By.css('[data-testid="submit-crear-servicio"]')),
            15000
        );

        await btnSubmit.click();

        const successAlert = await driver.wait(
            until.elementLocated(By.css('[data-testid="success-servicio-creado"]')),
            20000
        );

        await driver.wait(until.elementIsVisible(successAlert), 10000);

        const isDisplayed = await successAlert.isDisplayed();
        expect(isDisplayed).toBe(true);
    });
});
