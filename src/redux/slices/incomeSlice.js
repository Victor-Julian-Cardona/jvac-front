import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    incomes: [],
    isLoading: false,
    error: null
};

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        setIncome: ( _,{ payload}) => {
            return {
                incomes: [...payload]
            }
        }
    }

})


export default incomeSlice.reducer;

export const { setIncome } = incomeSlice.actions;