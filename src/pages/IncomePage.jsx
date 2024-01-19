import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { isEqual } from "underscore";
import { PORT } from "../../config";
import { setIncome } from "../redux/slices/incomeSlice";

export const IncomePage = () => {
    const state = useSelector(state => state);
    console.log(state)
    const incomes = useSelector(state => state.incomeSlice.incomes, isEqual);
    console.log(incomes)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUpdate = (incomeId) => {
        // Navigate to the update route with the income's ID
        navigate(`/profile/updateIncome/${incomeId}`);
    };

    const handleDelete = (incomeId) => {
        if (window.confirm("Are you sure you want to delete this income?")) {
            fetch(`${PORT}deleteIncome/${incomeId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error deleting income');
                }
                return fetch(`${PORT}getAllIncomes`);
            })
            .then(response => response.json())
            .then(updatedIncomes => {
                dispatch(setIncome(updatedIncomes));
                console.log(`Income with ID ${incomeId} has been deleted`);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };
    

    return (
        <div className="income-list">
            {incomes.map(income => (
                <div key={income._id} className="income-card">
                    <div><strong>Category:</strong> {income.category}</div>
                    <div><strong>Amount:</strong> ${income.amount}</div>
                    <div><strong>Description:</strong> {income.description}</div>
                    <div><strong>Recurrence:</strong> {income.recurrence}</div>
                    <button onClick={() => handleUpdate(income._id)}>Update</button>
                    <button onClick={() => handleDelete(income._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};
