import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PORT } from "../../config";
import { isUserAuthenticated, setUser } from "../redux/slices/userSlice";

export const SignupPage = () => {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useDispatch();
  const onSubmit = async ({ email, password, userName }) => {
    try {
      const newUser = await fetch(`${PORT}signup`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          userName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error(error);
        });
      const {
        body: { accessToken, user },
      } = newUser;
      localStorage.setItem("jvac-token", accessToken);
      dispatch(setUser(user));
    } catch (err) {
      console.error(err);
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
          onSubmit({ email, password, userName });
        }}
      >
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email"
        />
        <input
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          placeholder="username"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="password"
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            onSubmit({ email, password, userName });
          }}
        >
          {"Button"}
        </button>
      </form>
    </div>
  );
};
