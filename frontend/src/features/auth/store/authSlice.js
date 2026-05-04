import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  emailForOTP: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // لما يسجل بنجاح، نحفظ إيميله للخطوة الجاية
    setPendingEmail: (state, action) => {
      state.emailForOTP = action.payload;
    },
    // الدالة دي هنستخدمها لاحقاً لما يعمل Login أو Verify OTP
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.emailForOTP = null;
    },
    setInitialized: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setPendingEmail, setCredentials, logout, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
