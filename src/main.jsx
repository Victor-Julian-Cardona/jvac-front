import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { ExpenseFormPage } from "./pages/ExpenseFormPage.jsx";
import { ExpensePage } from "./pages/ExpensePage.jsx";
import { IncomeFormPage } from "./pages/IncomeFormPage.jsx";
import { IncomePage } from "./pages/IncomePage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { UpdateExpensePage } from "./pages/UpdateExpensePage.jsx";
import { UpdateIncomePage } from "./pages/UpdateIncomePage.jsx";
import { persistor, store } from "./redux/store.js";
import './styles/main.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            >
              {/* <Route path="monthly" element={<MonthlyPage />} />
              <Route path="yearly" element={<YearlyPage />} /> */}
              <Route path="incomeForm" element={<IncomeFormPage />} />
              <Route path="expenseForm" element={<ExpenseFormPage />} />
              <Route path="income" element={<IncomePage />} />
              <Route path="expense" element={<ExpensePage />} />
              <Route path="updateIncome/:incomeId" element={<UpdateIncomePage />} />
              <Route path="updateExpense/:expenseId" element={<UpdateExpensePage />} />
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
