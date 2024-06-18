import userData from '../fixtures/userFixture.json';


describe('iniciate game tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    
    cy.intercept('GET', 'http://localhost:3001/**', async (req) => {
      localStorage.setItem('user', JSON.stringify(userData));
    });
    cy.contains('Iniciar sesión').click();
  
    cy.visit('http://localhost:3000/');
  });
  
  
  it('language changes in category selection', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Comenzar juego');   
    cy.contains('Cambiar Idioma').click();
    cy.contains('Inglés').click();
    cy.contains('Start game');   

    cy.contains('Change Language').click();
    cy.contains('Spanish').click();
    cy.contains('Deporte');   
  });


  it('user can see his profile', () => {
    cy.contains('Perfil de Wikimedia').click();
  });


  it('user can see categories, choose and iniciate game', () => {
    cy.contains('Investigación');
    cy.contains('Deporte');
    cy.contains('Música');

    cy.contains('Deporte').click();
    cy.contains('Comenzar juego').click();
    cy.contains('OK').click();

    //change to principal screen
    cy.contains('Racha de preguntas');
  });

  it('user can logout', () => {
    cy.intercept('GET', 'http://localhost:3001/logout', async (req) => {
        localStorage.removeItem('user');
      });
    cy.contains('Cerrar sesión').click();
    cy.visit('http://localhost:3000/');
    cy.contains('Iniciar sesión');
  });

})