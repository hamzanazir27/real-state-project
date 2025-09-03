import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },

    signInSucess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFalure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signInStart, signInSucess, signInFalure } = userSlice.actions;

export default userSlice.reducer;
