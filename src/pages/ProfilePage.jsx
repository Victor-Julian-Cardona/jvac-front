import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { shallowEqual, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";


export const ProfilePage = () => {

    const user = useSelector((state = {}) => state.userSlice, shallowEqual);
    const navigate = useNavigate()
    return (
        <div>
            <h1>{`Welcome ${user.userName}`}</h1>
            <Tabs onChange={(_, value) => {
                navigate(value)
            }} >
                {/* <Tab value="./monthly" label="Monthly" />
                <Tab value="./yearly" label="Yearly"/> */}
                <Tab value="./incomeForm" label="Add Income"/>
                <Tab value="./expenseForm" label="Add Expense"/>
                <Tab value="./income" label="All Incomes"/>
                <Tab value="./expense" label="All Expenses"/>
            </Tabs>
            <Outlet />
        </div>
    )
}