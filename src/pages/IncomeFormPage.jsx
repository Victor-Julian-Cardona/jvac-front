import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PORT } from '../../config';
import { setIncome } from '../redux/slices/incomeSlice';

export const IncomeFormPage = () => {
    const [incomeData, setIncomeData] = useState({
        category: '',
        description: '',
        amount: '',
        recurrence: ''
    });

    const handleChange = (e) => {
        setIncomeData({ ...incomeData, [e.target.name]: e.target.value });
    };

    const [statusMessage, setStatusMessage] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        let timer;
        if (statusMessage) {
            timer = setTimeout(() => setStatusMessage(''), 5000);
        }
        return () => clearTimeout(timer);
    }, [statusMessage]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');

        try {
            const response = await fetch(`${PORT}createIncome`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jvac-token')}`
                },
                body: JSON.stringify(incomeData)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to add income. Please try again.');
            }

            const responseData = await response.json();

            // Dispatch the incomeArray received from the response
            if (responseData.incomeArray) {
                dispatch(setIncome(responseData.incomeArray));
                setStatusMessage('Income successfully added!');
            } else {
                throw new Error('Income array not received');
            }

            setTimeout(() => {
                setStatusMessage('');
            }, 5000);
            
            setIncomeData({
                category: '',
                description: '',
                amount: '',
                recurrence: ''
            });
        } catch (error) {
            console.error('Error adding income:', error);
            setStatusMessage(error.message || 'Failed to add income. Please try again.');
            setTimeout(() => {
                setStatusMessage('');
            }, 5000);
        }
    };




    return (
        <form onSubmit={handleSubmit}>
            <label>
                Category:
                <select name="category" value={incomeData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Wages">Wages</option>
                    <option value="Dividends">Dividends</option>
                    <option value="Interests">Interests</option>
                    <option value="Rents">Rents</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
            </label>
            <br />
            <label>
                Description:
                <input type="text" name="description" value={incomeData.description} onChange={handleChange} />
            </label>
            <br />
            <label>
                Amount:
                <input type="number" name="amount" value={incomeData.amount} onChange={handleChange} required />
            </label>
            <br />
            <label>
                Recurrence:
                <select name="recurrence" value={incomeData.recurrence} onChange={handleChange} required>
                    <option value="">Select Recurrence</option>
                    <option value="None">None</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </label>
            <br />
            <button type="submit">Add Income</button>
            {statusMessage && <div className="status-message">{statusMessage}</div>}
        </form>
    );
};
