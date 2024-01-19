import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import expenseSlice from "./slices/expenseSlice";
import incomeSlice from "./slices/incomeSlice";
import userSlice from "./slices/userSlice";

const persistConfig = {
    key: 'root',
    storage,
  };

const rootReducer = combineReducers({
  userSlice,
  incomeSlice,
  expenseSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    
});

export const persistor = persistStore(store);