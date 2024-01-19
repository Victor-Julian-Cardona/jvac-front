import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    expenses: [],
    isLoading: false,
    error: null
};

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        setExpense: ( _,{ payload}) => {
            return {
                expenses: [...payload]
            }
        }
    }

})


export default expenseSlice.reducer;

export const { setExpense } = expenseSlice.actions;