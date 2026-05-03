import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  emailForOTP: null, // هنحفظ فيه الإيميل مؤقتاً عشان شاشة الـ OTP
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
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.emailForOTP = null;
    },
  },
});

export const { setPendingEmail, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
