// tests/e2e/e2e-sequential.test.js
require('chromedriver');

import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

jest.setTimeout(180000); 

describe('E2E SECUENCIAL - Selenium Tests', () => {
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

  test('Cliente puede hacer logout correctamente', async () => {
    // LOGIN CLIENTE
    await driver.get('http://localhost:5173/iniciar-sesion');
    await (await driver.findElement(By.css('[data-testid="correo"] input'))).sendKeys('jonier.urrea@correounivalle.edu.co');
    await (await driver.findElement(By.css('[data-testid="password"] input'))).sendKeys('Jonier12@');
    await (await driver.findElement(By.css('[data-testid="login-btn"]'))).click();

    await driver.wait(until.urlContains('/cliente/inicio'), 20000);

    // Abrir menú y logout
    await (await driver.findElement(By.css('[data-testid="menu-open-btn"]'))).click();
    const btnLogout = await driver.findElement(By.css('[data-testid="logout-btn"]'));
    await btnLogout.click();

    await driver.wait(until.urlIs('http://localhost:5173/'), 20000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('http://localhost:5173/');
  });

  test('Admin puede crear un servicio correctamente', async () => {
    // LOGIN ADMIN
    await driver.get('http://localhost:5173/iniciar-sesion');
    await (await driver.findElement(By.css('[data-testid="correo"] input'))).sendKeys('jonier145@gmail.com');
    await (await driver.findElement(By.css('[data-testid="password"] input'))).sendKeys('Jonier25@');
    await (await driver.findElement(By.css('[data-testid="login-btn"]'))).click();
    await driver.wait(until.urlContains('/admin/inicio'), 20000);

    const btnNuevoServicio = await driver.wait(
                until.elementLocated(By.css('[data-testid="btn-nuevo-servicio"]')),
                15000
            );
    
            await btnNuevoServicio.click();
            await driver.wait(until.urlContains('/admin/registrar-servicio'), 20000);
    
            // CREAR SERVICIO
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

  test('Admin puede crear un tecnico correctamente', async () => {
    await driver.get('http://localhost:5173/admin/inicio');

    //  click en crear tecnico
    const btnNuevoTecnico = await driver.wait(
      until.elementLocated(By.css('[data-testid="btn-nuevo-tecnico"]')),
      15000
    );
    await btnNuevoTecnico.click();

    const inputNombre = await driver.wait(
      until.elementLocated(By.css('[data-testid="input-nombre-tecnico"] input')),
      20000
    );
    await driver.wait(until.elementIsVisible(inputNombre), 10000);

    // formulario tecnico
    const timestamp = Date.now();
    const nombreRandom = 'camilo';
    const correoRandom = `camilo${timestamp}@example.com`;

    await inputNombre.sendKeys(nombreRandom);
    await (await driver.findElement(By.css('[data-testid="input-apellido-tecnico"] input'))).sendKeys('Perez');
    await (await driver.findElement(By.css('[data-testid="input-cedula-tecnico"] input'))).sendKeys('1006346701');
    await (await driver.findElement(By.css('[data-testid="input-telefono-tecnico"] input'))).sendKeys('3001224567');
    await (await driver.findElement(By.css('[data-testid="input-cargo-tecnico"] input'))).sendKeys('Tecnico');
    await (await driver.findElement(By.css('[data-testid="input-email-tecnico"] input'))).sendKeys(correoRandom);
    await (await driver.findElement(By.css('[data-testid="input-password-tecnico"] input'))).sendKeys('Password123@');

    await (await driver.findElement(By.css('[data-testid="submit-crear-tecnico"]'))).click();

    const successAlert = await driver.wait(
      until.elementLocated(By.css('[data-testid="success-tecnico-creado"]')),
      20000
    );
    await driver.wait(until.elementIsVisible(successAlert), 10000);
    expect(await successAlert.isDisplayed()).toBe(true);
  });
});
