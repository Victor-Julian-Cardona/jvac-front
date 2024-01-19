import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PORT } from '../../config';
import { setExpense } from '../redux/slices/expenseSlice';

export const ExpenseFormPage = () => {
    const [expenseData, setExpenseData] = useState({
        category: '',
        description: '',
        amount: '',
        recurrence: ''
    });

    const [statusMessage, setStatusMessage] = useState('');
    useEffect(() => {
        return () => {
            clearTimeout();
        };
    }, []);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');
    
        try {
            const response = await fetch(`${PORT}createExpense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jvac-token')}`
                },
                body: JSON.stringify(expenseData)
            });
    
            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to add expense. Please try again.');
            }
    
            const result = await response.json();
            console.log('Expense added:', result);
    
            // Assuming result contains an updated list of expenses
            if (result.expenseArray) {
                dispatch(setExpense(result.expenseArray));
                setStatusMessage('Expense successfully added!');
            } else {
                throw new Error('Updated expense list not received');
            }
    
            setTimeout(() => {
                setStatusMessage('');
            }, 5000);
    
            // Reset form fields after successful submission
            setExpenseData({
                category: '',
                description: '',
                amount: '',
                recurrence: ''
            });
    
        } catch (error) {
            console.error('Error adding expense:', error);
            setStatusMessage(error.message || 'Failed to add expense. Please try again.');
            setTimeout(() => {
                setStatusMessage('');
            }, 5000);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Category:
                <select name="category" value={expenseData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Dining and Leisure">Dining and Leisure</option>
                    <option value="Food and Housekeeping">Food and Housekeeping</option>
                    <option value="Family and Housing">Family and Housing</option>
                    <option value="Car Maintenance">Car Maintenance</option>
                    <option value="Hobbies">Hobbies</option>
                </select>
            </label>
            <br />
            <label>
                Description:
                <input type="text" name="description" value={expenseData.description} onChange={handleChange} />
            </label>
            <br />
            <label>
                Amount:
                <input type="number" name="amount" value={expenseData.amount} onChange={handleChange} required />
            </label>
            <br />
            <label>
                Recurrence:
                <select name="recurrence" value={expenseData.recurrence} onChange={handleChange} required>
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
            <button type="submit">Add Expense</button>
            {statusMessage && <div className="status-message">{statusMessage}</div>}
        </form>
    );
};