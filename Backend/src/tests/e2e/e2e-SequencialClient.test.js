require('chromedriver');
import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

// Utilidad para pausar entre pasos visibles
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

jest.setTimeout(300000);

describe('E2E SECUENCIAL - Selenium Tests (Modo Visible y Lento)', () => {
  let driver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--start-maximized');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().setTimeouts({ implicit: 15000 });
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('Cliente puede editar su perfil correctamente', async () => {
    // LOGIN
    await driver.get('http://localhost:5173/iniciar-sesion');
    await delay(2000);

    await driver.findElement(By.css('[data-testid="correo"] input')).sendKeys('jonier.urrea@correounivalle.edu.co');
    await delay(1000);
    await driver.findElement(By.css('[data-testid="password"] input')).sendKeys('Jonier12@');
    await delay(1000);
    await driver.findElement(By.css('[data-testid="login-btn"]')).click();
    await driver.wait(until.urlContains('/cliente/inicio'), 20000);
    await delay(2000);

    // IR AL PERFIL
    const profileIcon = await driver.findElement(By.css('[data-testid="profile-icon"]'));
    await profileIcon.click();
    await delay(1000);

    const profileOption = await driver.findElement(By.css('[data-testid="floating-menu-perfil"]'));
    await profileOption.click();
    await driver.wait(until.urlContains('/cliente/perfil'), 10000);
    await delay(2000);

    const editProfileBtn = await driver.findElement(By.css('[data-testid="edit-profile-btn"]'));
    await editProfileBtn.click();
    await driver.wait(until.urlContains('/cliente/editar-perfil'), 10000);
    await delay(3000);

    // FORMULARIO
    const formFields = [
      { selector: '[data-testid="input-cedula"] input', value: '1556326602' },
      { selector: '[data-testid="input-nombre"] input', value: 'Juan' },
      { selector: '[data-testid="input-apellido"] input', value: 'Torres' },
      { selector: '[data-testid="input-email"] input', value: 'juan.torres@example.com' },
      { selector: '[data-testid="input-direccion"] input', value: 'Calle 123 #45-67' },
      { selector: '[data-testid="input-celular"] input', value: '3001234567' },
    ];

   for (const { selector, value } of formFields) {
        const el = await driver.wait(until.elementLocated(By.css(selector)), 10000);
        await driver.wait(until.elementIsVisible(el), 10000);

        // Borrar correctamente el texto previo
        await el.click(); // enfoca el campo
        await delay(300);
        await el.sendKeys(process.platform === 'darwin' ? Key.COMMAND : Key.CONTROL, 'a'); // Ctrl+A o Cmd+A
        await delay(200);
        await el.sendKeys(Key.BACK_SPACE); // eliminar contenido
        await delay(300);

        // Escribir el nuevo valor
        await el.sendKeys(value);
        await delay(1000);
    }

    // GUARDAR CAMBIOS
    const saveButton = await driver.findElement(By.css('[data-testid="btn-guardar"]'));
    await saveButton.click();
    await delay(2000);

    // CONFIRMAR ÉXITO
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'La informacion fue editada con exito')]")),
      20000
    );

     // Abrir menú y logout
    await (await driver.findElement(By.css('[data-testid="menu-open-btn"]'))).click();
    await delay(2000);

    // da clic en el boton de inicio
    await (await driver.findElement(By.css('[data-testid="home-btn"]'))).click();
    await delay(2000);

    // da clic en cualquier parte de la pantalla para cerrar el menu
    await (await driver.findElement(By.css('body'))).click();
    await delay(2000);

    // Scroll suave hacia abajo
    await driver.executeScript(`
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    `);
    await delay(1500);

    // Scroll suave hacia arriba
    await driver.executeScript(`
    window.scrollTo({ top: 0, behavior: 'smooth' });
    `);
    await delay(1500);

    // da clic en el boton ver mas
    await (await driver.findElement(By.css('[data-testid="ver-mas-button"]'))).click();
    await delay(2000);

    // da clic en el boton solicitar revision
    await (await driver.findElement(By.css('[data-testid="solicitar-revision-btn"]'))).click();
    await delay(2000);

    // llena el formulario de solicitud de servicio
    await (await driver.findElement(By.css('[data-testid="input-direccion-servicio"] input'))).sendKeys('Calle 123 #45-67');
    await delay(1000);
    await (await driver.findElement(By.css('[data-testid="input-descripcion-problema"] input'))).sendKeys('El aire acondicionado no enfría.');
    await delay(1000);
    await (await driver.findElement(By.css('[data-testid="input-comentarios-adicionales"] input'))).sendKeys('Por favor, atender con urgencia.');
    await delay(1000);

    // envía el formulario de solicitud de servicio
    await (await driver.findElement(By.css('[data-testid="confirmar-solicitud-btn"]'))).click();
    console.log("💾 Formulario de solicitud de servicio enviado");
    await delay(2000);

    // cerrar el modal de éxito
    await (await driver.findElement(By.css('[data-testid="cerrar-btn"]'))).click();
    await delay(2000);

    // Abrir menú 
    await (await driver.findElement(By.css('[data-testid="menu-open-btn"]'))).click();
    await delay(2000);

    // da clic en el boton de servicio
    await (await driver.findElement(By.css('[data-testid="servicios-btn"]'))).click();
    await delay(2000);

    // da clic en cualquier parte de la pantalla para cerrar el menu
    await (await driver.findElement(By.css('body'))).click();
    await delay(2000);

    // escibe en la barra de busqueda
    const searchInput = await driver.findElement(By.css('[data-testid="input-buscar-servicio"] input'));
    await searchInput.sendKeys('Suministro, instalacion y mantenimiento a brazos hidraulicos');
    await delay(1000);

    // Abrir menú y logout
    await (await driver.findElement(By.css('[data-testid="menu-open-btn"]'))).click();
    const btnLogout = await driver.findElement(By.css('[data-testid="logout-btn"]'));
    await btnLogout.click();

    // Scroll suave hacia arriba
    await driver.executeScript(`
    window.scrollTo({ top: 0, behavior: 'smooth' });
    `);
    await delay(1500);

    // Scroll suave hacia abajo
    await driver.executeScript(`
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    `);
    await delay(1500);

    await driver.wait(until.urlIs('http://localhost:5173/'), 20000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('http://localhost:5173/');

    await delay(4000);
  });
});
