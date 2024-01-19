import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PORT } from "../../config";
import { setExpense } from "../redux/slices/expenseSlice";
import { setIncome } from "../redux/slices/incomeSlice";
import { isUserAuthenticated, setUser } from "../redux/slices/userSlice";

export const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();

  const onSubmit = async ({ email, password }) => {
    try {
      const response = await fetch(`${PORT}login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error(error);
        });
        console.log({response});
      const { body: {accessToken, user, incomeArray, expenseArray} } = response;
      localStorage.setItem("jvac-token", accessToken);
      console.log({response});
      dispatch(setUser(user))
      dispatch(setIncome(incomeArray))
      dispatch(setExpense(expenseArray))
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  useEffect(() => {
    dispatch(isUserAuthenticated());
  }, []);
  const user = useSelector((state = {}) => state.userSlice, shallowEqual);
  console.log({ user });
  if (user.isUserAuthenticated) {
    return <Navigate to="/profile" />;
  }
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ email, password });
        }}
      >
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="password"
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            onSubmit({ email, password });
          }}
        >
          {"Button"}
        </button>
      </form>
    </div>
  );
};
