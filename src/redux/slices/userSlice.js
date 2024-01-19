import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PORT } from "../../../config";
export const isUserAuthenticated = createAsyncThunk(
  "user/isUserAuthenticated",
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("jvac-token");
    if (accessToken) {
      const isUserAuthenticated = await fetch(
        `${PORT}isUserAuthenticated`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .catch((error) => {
          console.error(error);
          localStorage.removeItem("jvac-token");
          return rejectWithValue(false);
        });
      console.log(isUserAuthenticated);
      return true;
    } else {
      return rejectWithValue(false);
    }
  }
);

const initialState = {
  userName: "",
  email: "",
  isLoggedIn: false,
  isLoading: false,
  isUserAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      const { userName, email } = payload;
      return { ...state, userName, email, isLoggedIn: true, isUserAuthenticated: true };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(isUserAuthenticated.fulfilled, (state = {}) => {
        return { ...state, isUserAuthenticated: true, isLoading: false, isLoggedIn: true };
      })
      .addCase(isUserAuthenticated.rejected, (state = {}) => {
        return { ...state, isUserAuthenticated: false, isLoading: false, isLoggedIn: false };
      })
      .addCase(isUserAuthenticated.pending, (state = {}) => {
        return { ...state, isLoading: true };
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
