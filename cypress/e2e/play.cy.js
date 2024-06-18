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
  

  it('user change category ', () => {
    cy.contains('Música').click();
    cy.contains('Comenzar juego').click();
    cy.contains('OK').click();

    cy.wait(10000); 

    cy.contains('deporte').click();
    cy.contains('Vas a cambiar de categoría');
    cy.contains('OK').click();
    cy.contains('Has cambiado de categoría');
  });
  

  it('user gives up', () => {
    cy.contains('Música').click();
    cy.contains('Comenzar juego').click();
    cy.contains('OK').click();

    cy.wait(10000); 

    cy.contains('Rendirse').click();
    cy.contains('Si').click();
    cy.contains('Te has rendido');
  });

  it('user see rankings', () => {
    cy.contains('Ver clasificación').click();
    cy.contains('Clasificación de rachas de preguntas contestadas');
    cy.contains('Nombre de usuario');
    cy.contains('Preguntas');

    cy.contains('Mis resultados').click();
    cy.contains('Nombre de usuario').should('not.exist');

  });


  it('user answer the question', () => {
    //for the tests it is simulated the call to the api
    cy.contains('Deporte').click();
    cy.contains('Comenzar juego').click();
    cy.contains('OK').click();

    
    cy.wait(40000); 

    cy.get('#basic_respuesta').type(200);
    cy.get('#basic_urldereferencia').type('https://ejemplodeurl.com');

    cy.contains('Enviar respuesta').click();

    cy.contains('Cambiar de entidad').click();

    cy.contains('Respuesta enviada');

    cy.contains('1');  //streak increases 1
  });
})