import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PORT } from '../../config';
import { setIncome } from '../redux/slices/incomeSlice';

export const UpdateIncomePage = () => {
    const [formData, setFormData] = useState({
        source: '',
        amount: '',
        recurrence: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const { incomeId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('jvac-token');

        if (!token) {
            setError('No token found');
            setIsLoading(false);
            return;
        }

        fetch(`${PORT}getIncome/${incomeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not fetch income data');
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
    }, [incomeId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');

        const token = localStorage.getItem('jvac-token');
        if (!token) {
            setStatusMessage('No token found. Unable to update.');
            setTimeout(() => setStatusMessage(''), 5000);
            return;
        }

        fetch(`${PORT}updateIncome/${incomeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating income');
                }

                return response.json();
            })
            .then(data => {
                console.log(data.incomeArray);
                dispatch(setIncome(data.incomeArray));
                setStatusMessage('Income updated successfully!');
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
            <h2>Update Income</h2>
            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    {/* Populate with income categories */}
                    <option value="Wages">Wages</option>
                    <option value="Dividends">Dividends</option>
                    <option value="Interests">Interests</option>
                    <option value="Rents">Rents</option>
                    <option value="Miscellaneous">Miscellaneous</option>
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
                    <option value="None">None</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </div>

            <button type="submit">Update Income</button>

            {statusMessage && <div className="status-message">{statusMessage}</div>}
        </form>
    );


};
