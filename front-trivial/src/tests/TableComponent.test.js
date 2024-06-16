import React from 'react';
import {screen, render, waitFor , cleanup, fireEvent} from '@testing-library/react';
import TableComponent from '../components/TableComponent';
import axios from 'axios';

jest.mock('axios');
afterEach(cleanup);

describe('TableComponent Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
        
    });

    beforeEach(() => {
        window.matchMedia = jest.fn().mockImplementation(query => {
            return {
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), 
                removeListener: jest.fn(), 
                addEventListener: jest.fn(), 
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            };
        });
    });


    test('displays classifications correctly and all filters work ok', async () => {
        const today = new Date().toISOString().split('T')[0];

        const streaksData = [
            { id: 1, username: 'user1', streak: 5, category: 'deporte', date: today },
            { id: 2, username: 'user2', streak: 3, category: 'música', date: today },
            { id: 3, username: 'testuser', streak: 2, category: 'investigación', date: today },
        ];

        axios.get.mockClear();
        axios.get.mockResolvedValueOnce({ data: streaksData });

        const { getByText } = render(<TableComponent user={{ _json: { username: 'testuser' } }} />);

        await waitFor(() => {
            const usernameElement = getByText('user1');
            expect(usernameElement).toBeInTheDocument();
        });

        expect(getByText('table.deporte')).toBeInTheDocument();
        expect(getByText('table.música')).toBeInTheDocument();

        const buttonWeek = getByText('table.week');  
        const buttonWeekInput = buttonWeek.previousElementSibling;
        fireEvent.click(buttonWeekInput);

        expect(getByText('table.deporte')).toBeInTheDocument();         //still shows in week
        const onlyMine = getByText('table.myRanking');
        fireEvent.click(onlyMine);
        expect(getByText('table.investigación')).toBeInTheDocument();        //if only mine (testuser) only shows the streak of research
        expect(screen.queryByText('table.deporte')).not.toBeInTheDocument();        //the rest dont show
    });


    test('shows notification if classifications fail to load', async () => {
        axios.get.mockClear();
        jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Failed to fetch'));

        const { getByText } = render(<TableComponent user={{ _json: { username: 'testuser' } }} />);

        await waitFor(() => {
            expect(getByText('table.errorDesc')).toBeInTheDocument();
        });
    });
});
