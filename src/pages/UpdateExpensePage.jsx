import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PORT } from '../../config';
import { setExpense } from '../redux/slices/expenseSlice';

export const UpdateExpensePage = () => {
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        amount: '',
        recurrence: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const { expenseId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('jvac-token');

        if (!token) {
            setError('No token found');
            setIsLoading(false);
            return;
        }

        fetch(`${PORT}getExpense/${expenseId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not fetch expense data');
            }
            return response.json();
        })
        .then(data => {
            setFormData(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            setError(error.message);
            setIsLoading(false);
        });
    }, [expenseId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatusMessage('');

        const token = localStorage.getItem('jvac-token');
        if (!token) {
            setStatusMessage('No token found. Unable to update.');
            setTimeout(() => setStatusMessage(''), 5000);
            return;
        }

        fetch(`${PORT}updateExpense/${expenseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating expense');
            }

            return response.json();
        })
        .then(data => {
            console.log(data.expenseArray)
            dispatch(setExpense(data.expenseArray));
            setStatusMessage('Expense updated successfully!');
            setTimeout(() => setStatusMessage(''), 5000);
        })
        .catch(error => {
            console.error('Error:', error);
            setStatusMessage(error.message);
            setTimeout(() => setStatusMessage(''), 5000);
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Expense</h2>
            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    {/* Populate with categories */}
                    <option value="Dining and Leisure">Dining and Leisure</option>
                    <option value="Food and Housekeeping">Food and Housekeeping</option>
                    <option value="Family and Housing">Family and Housing</option>
                    <option value="Car Maintenance">Car Maintenance</option>
                    <option value="Hobbies">Hobbies</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="recurrence">Recurrence:</label>
                <select
                    name="recurrence"
                    value={formData.recurrence}
                    onChange={handleChange}
                    required
                >
                    {/* Populate with recurrence options */}
                    <option value="None">None</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </div>

            <button type="submit">Update Expense</button>

            {statusMessage && <div className="status-message">{statusMessage}</div>}
        </form>
    );
};
