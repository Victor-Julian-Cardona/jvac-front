import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { isEqual } from "underscore";
import { PORT } from "../../config";
import { setExpense } from "../redux/slices/expenseSlice";

export const ExpensePage = () => {
    const expenses = useSelector(state => state.expenseSlice.expenses, isEqual);
    console.log(expenses)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUpdate = (expenseId) => {
        // Navigate to the update route with the expense's ID
        navigate(`/profile/updateExpense/${expenseId}`);
    };


    const handleDelete = (expenseId) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            fetch(`${PORT}deleteExpense/${expenseId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error deleting expense');
                    }
                    return fetch(`${PORT}getAllExpenses`); // Fetch the updated list of expenses
                })
                .then(response => response.json())
                .then(updatedExpenses => {
                    dispatch(setExpense(updatedExpenses)); // Dispatch setExpenses with the updated list
                    console.log(`Expense with ID ${expenseId} has been deleted`);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };


    return (
        <div className="income-list">
            {expenses.map(expense => (
                <div key={expense._id} className="income-card">
                    <div><strong>Category:</strong> {expense.category}</div>
                    <div><strong>Amount:</strong> ${expense.amount}</div>
                    <div><strong>Description:</strong> {expense.description}</div>
                    <div><strong>Recurrence:</strong> {expense.recurrence}</div>
                    <button onClick={() => handleUpdate(expense._id)}>Update</button>
                    <button onClick={() => handleDelete(expense._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};
