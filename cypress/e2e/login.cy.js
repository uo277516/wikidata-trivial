import userData from '../fixtures/userFixture.json';


describe('e2e tests', () => {
  it('language changes', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Inicio de sesión');   
    cy.contains('Cambiar Idioma').click();
    cy.contains('Inglés').click();
    cy.contains('Login');   

    cy.contains('Change Language').click();
    cy.contains('Spanish').click();
    cy.contains('Iniciar sesión');   
  });

  it('user log redirects', () => {
    cy.visit('http://localhost:3000/');
    
    cy.intercept('GET', 'http://localhost:3001/**', async (req) => {
      localStorage.setItem('user', JSON.stringify(userData));
    });
    cy.contains('Iniciar sesión').click();
  
    cy.visit('http://localhost:3000/');

  });

})