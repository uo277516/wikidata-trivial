Cypress.config('experimentalSessionSupport', true)  // set this flag

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
    cy.contains('Iniciar sesión').click();   

    cy.origin('https://meta.wikimedia.org', () => {
      cy.contains("Wikimedia");
    });



  });

})