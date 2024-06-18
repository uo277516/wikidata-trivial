import userData from '../fixtures/userFixture.json';


describe('play complete game', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/');

    cy.intercept('GET', 'http://localhost:3001/login', async (req) => {
      localStorage.setItem('user', JSON.stringify(userData));
    });
    cy.contains('Iniciar sesión').click();
  
    cy.visit('http://localhost:3000/');

    
  });
  
  
  it('user sees the questions', () => {
    cy.contains('Deporte').click();
    cy.contains('Comenzar juego').click();
    cy.contains('OK').click();

    cy.contains('Cargando pregunta...');
  });


  it('user answer the question', () => {
    //for the tests it is simulated the call to the api
    cy.contains('Deporte').click();
    cy.contains('Comenzar juego').click();
    cy.contains('OK').click();

    
    cy.wait(30000); 

    cy.get('#basic_respuesta').type(200);
    cy.get('#basic_urldereferencia').type('https://ejemplodeurl.com');

    cy.contains('Enviar respuesta').click();

    cy.contains('Cambiar de entidad').click();

    cy.contains('Respuesta enviada');

    cy.contains('1');  //streak increases 1
  });
  

})