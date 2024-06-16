import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PrincipalScreen from '../components/PrincipalScreen';
import axios from 'axios';
import userEvent from '@testing-library/user-event'
import { fetchData } from '../services/questionsService'; // Importa fetchData del servicio



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
    //to test notification error
    fetchQuestionsGroups: await jest.fn().mockRejectedValue(new Error('Failed to fetch questions for groups')),
    checkProperties: await jest.fn().mockResolvedValue({
        relacionesFalsas: 'P988'
    })
}));

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: { streaks: [1, 2, 3] } }),
}));


jest.mock('../services/questionsService', () => ({
    fetchData: jest.fn(),
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

  });



  test('sends answer, updates streak, notification, question loads again', async () => {
    axios.get.mockClear();
    axios.get.mockResolvedValueOnce({ sucess: true });


    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    //question card
    await waitFor(() => {
        const questionCard = document.getElementsByClassName('ant-card ant-card-bordered')[0];
        expect(questionCard).toBeInTheDocument(); 
    });

    fireEvent.change(screen.getByPlaceholderText('question.answer'), { target: { value: '200' } });
    fireEvent.change(screen.getByPlaceholderText('question.urlExample'), { target: { value: 'https://example.com' } });

    fireEvent.click(screen.getByText('question.buttonSend'));

    await waitFor(() => {
        const pop = screen.getByText('question.popChangeEntity');
        expect(pop).toBeInTheDocument();
        const ok = screen.getByText('question.continueEntity');
        expect(ok).toBeInTheDocument();
        fireEvent.click(ok);
    });

    //questions loads again
    await waitFor(() => {
        expect(screen.getByText('question.load')).toBeInTheDocument();
        expect(screen.getByText('question.buttonSend').closest('button')).not.toBeEnabled();
        expect(screen.getByText('question.popGiveUp').closest('button')).not.toBeEnabled();
    });
 
  });


  test('notification error when questions can not be load', async () => {
    fetchData.mockRejectedValue(new Error('Fake error'));
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="música" categories={categories} user={user} />);

    await waitFor(() => {
        const errorAlert = screen.getAllByRole('alert')[0];
        expect(errorAlert).toBeInTheDocument();
    });
    
  });


  test('answer not send if invalid fomat', async () => {
    axios.get.mockClear();
    axios.get.mockResolvedValueOnce({ sucess: true });

    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    await waitFor(() => {
        const questionCard = document.getElementsByClassName('ant-card ant-card-bordered')[0];
        expect(questionCard).toBeInTheDocument(); 
    });

    fireEvent.change(screen.getByPlaceholderText('question.answer'), { target: { value: '200' } });
    fireEvent.change(screen.getByPlaceholderText('question.urlExample'), { target: { value: 'invalidformatforurl' } });
    
    fireEvent.click(screen.getByText('question.buttonSend'));

    await waitFor(() => {
        expect(screen.getByText('form.error')).toBeInTheDocument();        //not error format aswers
        expect(screen.queryByText('question.load')).toBeNull();            //it doesnt sent, same screen
    });

  });


});
