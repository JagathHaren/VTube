import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Load from localStorage on app start
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
const storedToken = JSON.parse(localStorage.getItem("token")) || null;
// Async actions
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
  return null;
});


// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,               // ✅ start with persisted user
    token: storedToken,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token
        // ✅ persist
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", JSON.stringify(state.token));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // ✅ persist
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // ✅ persist
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.subscriptions = [];
        // ✅ clear
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("subscriptions");
      })
  },
});

export default authSlice.reducer;
