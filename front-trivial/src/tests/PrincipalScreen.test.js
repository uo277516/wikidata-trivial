import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PrincipalScreen from '../components/PrincipalScreen';
import axios from 'axios';
import userEvent from '@testing-library/user-event'
import { editEntity, fetchData } from '../services/questionsService'; // Importa fetchData del servicio



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
    editEntity: jest.fn(),
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

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    expect(screen.getByText('table.deporte')).toBeInTheDocument();
    expect(screen.getByText('table.música')).toBeInTheDocument();
    expect(screen.getByText('table.investigación')).toBeInTheDocument();

    await waitFor(() => {       //wait till the button for change is enabled (question load)
        const sportTableButton = screen.getByText('table.música');
        expect(sportTableButton).toBeEnabled(); 
    });

    fireEvent.click(screen.getByText('table.música'));

    await waitFor(() => {           //pop that asks if you sure of change the category
        const ok = screen.getByText('OK');
        expect(ok).toBeInTheDocument();
        fireEvent.click(ok);
    });

    expect(screen.getByText('question.beginAgain')).toBeInTheDocument();
    expect(screen.getByText('question.youChangeCat')).toBeInTheDocument();   //info that you change cat and the streak
  });



  test('sends answer, updates streak, notification, question loads again', async () => {
    axios.get.mockClear();
    axios.get.mockResolvedValueOnce({ sucess: true });


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

    const btn = screen.getByText('question.buttonSend').closest('button');
    console.log("-- " + btn);
    fireEvent.click(btn);

    console.log(container.innerHTML);

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
    fetchData.mockRejectedValue(new Error('Mock error for load questions'));
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="música" categories={categories} user={user} />);

    await waitFor(() => {
        const errorAlert = screen.getAllByRole('alert')[0];   //error for the questions
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
        expect(screen.getAllByText('form.error')[0]).toBeInTheDocument();        //not error format aswers
        expect(screen.queryByText('question.load')).toBeNull();            //it doesnt sent, same screen
    });
  });


  test('notification error when answer can not be send', async () => {
    editEntity.mockRejectedValue(new Error('Mock error for send answers'));

    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

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

    await waitFor(() => {
        const errorAlert = screen.getAllByRole('alert')[0];
        expect(errorAlert).toBeInTheDocument();
    });
  });


  test('notification error when streak cant be save or shown', async () => {
    const mockError = new Error('Mock error for cant not save the streaks');
    axios.get.mockRejectedValue(mockError);

    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    const consoleErrorSpy = jest.spyOn(console, 'error');
    consoleErrorSpy.mockImplementation(() => {});

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

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

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching streaks:', mockError);
  });



  test('user can give up', async () => {
    const categories = ['investigación', 'deporte', 'música']; 
    const user = { _json: { username: 'testuser' } }; 

    render(<PrincipalScreen category="deporte" categories={categories} user={user} />);

    await waitFor(() => {
        const questionCard = document.getElementsByClassName('ant-card ant-card-bordered')[0];
        expect(questionCard).toBeInTheDocument(); 
    });

    //1 is the button, the 'closest' is bc it renders as a span surronded by a button
    const buttonGiveUp = screen.getByText('question.popGiveUp').closest('button');
    expect(buttonGiveUp).toBeInTheDocument();       //button shown on the screen
    fireEvent.click(buttonGiveUp);

    await waitFor(() => {
        const pop = screen.getAllByText('question.popGiveUp')[0];   //0 its the pop it has the same label for the translations
        expect(pop).toBeInTheDocument();
        const ok = screen.getByText('yes');
        expect(ok).toBeInTheDocument();
        fireEvent.click(ok);
    });

    expect(screen.getByText('question.beginAgain')).toBeInTheDocument();
    expect(screen.getByText('question.giveup')).toBeInTheDocument();
  });


});
