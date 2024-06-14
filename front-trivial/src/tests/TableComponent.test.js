import React from 'react';
import { render, waitFor , cleanup} from '@testing-library/react';
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


    test('displays classifications correctly', async () => {
        const streaksData = [
            { id: 1, username: 'user1', streak: 5, category: 'deporte', date: '2024-06-15' },
            { id: 2, username: 'user2', streak: 3, category: 'música', date: '2024-06-15' },
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
