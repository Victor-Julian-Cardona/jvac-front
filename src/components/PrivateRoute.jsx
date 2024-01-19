/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../redux/slices/userSlice";
export const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state = {}) => state.userSlice, shallowEqual);
  useEffect(() => {
    dispatch(isUserAuthenticated());
  }, []);
  console.log(user);
  return user.isUserAuthenticated ? children : <Navigate to="/" />;
};
export default PrivateRoute;
