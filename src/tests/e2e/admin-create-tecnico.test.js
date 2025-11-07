// tests/e2e/admin-create-tecnico.test.js
require('chromedriver');

import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

jest.setTimeout(150000);

describe('ADMIN - CREAR TECNICO - E2E', () => {
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

    test('admin debe poder crear un tecnico correctamente', async () => {
        const loginUrl = 'http://localhost:5173/iniciar-sesion';
        const adminEmail = 'jonier145@gmail.com';
        const adminPassword = 'Jonier25@';

        // LOGIN ADMIN
        await driver.get(loginUrl);
        const inputCorreo = await driver.wait(until.elementLocated(By.css('[data-testid="correo"] input')), 15000);
        const inputPassword = await driver.wait(until.elementLocated(By.css('[data-testid="password"] input')), 15000);
        const btnLogin = await driver.wait(until.elementLocated(By.css('[data-testid="login-btn"]')), 15000);

        await inputCorreo.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, adminEmail);
        await inputPassword.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, adminPassword);
        await btnLogin.click();

        await driver.wait(until.urlContains('/admin/inicio'), 40000);

        // CLICK CREA NUEVO TECNICO
        const btnNuevoTecnico = await driver.wait(until.elementLocated(By.css('[data-testid="btn-nuevo-tecnico"]')), 15000);
        await btnNuevoTecnico.click();

        // ESPERAR A QUE EL FORMULARIO SEA VISIBLE
        const inputNombreTecnico = await driver.wait(until.elementLocated(By.css('[data-testid="input-nombre-tecnico"] input')), 20000);
        await driver.wait(async () => await inputNombreTecnico.isDisplayed(), 10000);

        // FORM CREAR TECNICO
        const timestamp = Date.now();
        const nombreRandom = 'Juan';
        const correoRandom = `juan${timestamp}@example.com`;

        await inputNombreTecnico.sendKeys(nombreRandom);
        await (await driver.findElement(By.css('[data-testid="input-apellido-tecnico"] input'))).sendKeys('Perez');
        await (await driver.findElement(By.css('[data-testid="input-cedula-tecnico"] input'))).sendKeys('1006326701');
        await (await driver.findElement(By.css('[data-testid="input-telefono-tecnico"] input'))).sendKeys('3001234567');
        await (await driver.findElement(By.css('[data-testid="input-cargo-tecnico"] input'))).sendKeys('Mantenimiento');
        await (await driver.findElement(By.css('[data-testid="input-email-tecnico"] input'))).sendKeys(correoRandom);
        await (await driver.findElement(By.css('[data-testid="input-password-tecnico"] input'))).sendKeys('Password123@');

        const btnSubmit = await driver.findElement(By.css('[data-testid="submit-crear-tecnico"]'));
        await btnSubmit.click();

        // ESPERA CON RETRY PARA MUI COLLAPSE
        await driver.wait(async () => {
            try {
                const successAlert = await driver.findElement(By.css('[data-testid="success-tecnico-creado"]'));
                return await successAlert.isDisplayed();
            } catch (err) {
                return false;
            }
        }, 20000, 'El alert de éxito no apareció en 20s');

        const successAlert = await driver.findElement(By.css('[data-testid="success-tecnico-creado"]'));
        const isDisplayed = await successAlert.isDisplayed();
        expect(isDisplayed).toBe(true);
    });
});
