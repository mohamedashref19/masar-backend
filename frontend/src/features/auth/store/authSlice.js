import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null, // ممكن منحتجش نحفظ التوكن في الريدكس لو الباك إند بيعتمد على الكوكي كلياً، بس هنسيبه احتياطي
  emailForOTP: null,
  isInitializing: true, // 👈 دي مهمة جداً عشان هنعمل Loading لحد ما نتأكد هو عامل لوجين ولا لأ
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.emailForOTP = null;
    },
    setPendingEmail: (state, action) => {
      state.emailForOTP = action.payload;
    },
    setInitialized: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setPendingEmail, setCredentials, logout, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
