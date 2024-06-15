import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PrincipalScreen from '../components/PrincipalScreen';
import axios from 'axios';
import { click } from '@testing-library/user-event/dist/cjs/convenience/click.js';
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';

jest.mock('axios');

//necesary for the tests bc the questions take too long to load and gives timeout
jest.mock('../services/questionsService', async () => ({
    fetchQuestionsResearchers: await jest.fn().mockResolvedValue({
        question: '¿Cuál es la fecha de nacimiento de Eistein?',
        entity: 'Q12',
        relation: 'P98',
        imageUrl: 'https://example.com/francia.jpg',
        labelEntity: 'Einstein',
    }),
    fetchQuestionsFootballers: await jest.fn().mockResolvedValue({
        question: '¿Cuantos goles marcó Messi en toda su carrera?',
        entity: 'Q89',
        relation: 'P17',
        imageUrl: 'https://example.com/messi.jpg',
        labelEntity: 'Messi',
    }),
    fetchQuestionsGroups: await jest.fn().mockResolvedValue({
        question: '¿En que año se fundó el grupo "The Beatles"?',
        entity: 'Q187',
        relation: 'P76',
        imageUrl: 'https://example.com/beatles.jpg',
        labelEntity: 'The Beatles',
    }),
}));

describe('PrincipalScreen tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: []
    });
  });


  test('renders component with initial loading state', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="investigación" categories={categories} user={user} />);

    expect(screen.getByText('Wiki Trivial')).toBeInTheDocument();
    expect(screen.getByText(/question.info2/i)).toBeInTheDocument();
  });


  test('fetches questions, categories appears on screen and change category', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } };

    const {container} = render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    expect(screen.getByText('table.deporte')).toBeInTheDocument();
    expect(screen.getByText('table.música')).toBeInTheDocument();
    expect(screen.getByText('table.investigación')).toBeInTheDocument();

    await waitFor(() => {
        const sportTableButton = screen.getByText('table.música');
        expect(sportTableButton).toBeEnabled(); 
    });

    fireEvent.click(screen.getByText('table.música'));

    await waitFor(() => {
        const ok = screen.getByText('OK');
        expect(ok).toBeInTheDocument();
        fireEvent.click(ok);
    });

    expect(screen.getByText('question.beginAgain')).toBeInTheDocument();

    console.log(container.innerHTML);
  });



  test('sends answer and updates streak', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    const {container} = render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    //question card
    await waitFor(() => {
        const questionCard = document.getElementsByClassName('ant-card ant-card-bordered')[0];
        expect(questionCard).toBeInTheDocument(); 
    });

    fireEvent.change(screen.getByPlaceholderText('question.answer'), { target: { value: '200' } });
    fireEvent.change(screen.getByPlaceholderText('question.urlExample'), { target: { value: 'https://example.com' } });

    fireEvent.click(screen.getByText('question.buttonSend'));

    await waitFor(() => {
        //'question.popChangeEntity'
        const pop = screen.getByText('question.popChangeEntity');
        expect(pop).toBeInTheDocument();
        const ok = screen.getByText('question.continueEntity');
        expect(ok).toBeInTheDocument();
        fireEvent.click(ok);
        expect(screen.getByText('question.ranking')).toHaveTextContent('1');
    });

    console.log(container.innerHTML);


    await waitFor(() => {
        
    });

    // // Verifica que se actualice la racha de respuestas correctas
    // await waitFor(() => {
    //   expect(screen.getByText('Ranking')).toHaveTextContent('1');
    // }); 
  });


});
