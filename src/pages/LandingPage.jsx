import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../redux/slices/userSlice";


export const LandingPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(isUserAuthenticated());
    }, []);
    const user = useSelector((state = {}) => state.userSlice, shallowEqual);
    console.log({ user });
    if (user.isUserAuthenticated) {
        return <Navigate to="/profile" />;
    }
    else
        return (
            <div className="landing-page">
                <h1>Welcome to JVAC</h1>
                <div className="buttons">
                    <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                    <Link to="/login" className="btn btn-login">Login</Link>
                </div>
            </div>
        );
};