import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STORAGE_KEY = "animal_advisor_auth";

function loadSavedAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, token: null };
  }
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: data.user, token: data.token })
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: data.user, token: data.token })
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDbStatus = createAsyncThunk(
  "auth/fetchDbStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/db-status");
      if (!res.ok) throw new Error("No se pudo consultar el estado de MongoDB Atlas");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const connectMongoAtlasUri = createAsyncThunk(
  "auth/connectMongoAtlas",
  async (mongoUri, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      const res = await fetch("/api/db-connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ mongoUri })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "No se pudo conectar a MongoDB Atlas");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const saved = loadSavedAuth();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: saved.user,
    token: saved.token,
    loading: false,
    error: null,
    dbStatus: {
      isMongoConnected: false,
      mode: "JSON Local + Ready for MongoDB Atlas",
      hasUriConfigured: false
    }
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      window.localStorage.removeItem(STORAGE_KEY);
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDbStatus.fulfilled, (state, action) => {
        state.dbStatus = action.payload;
      })
      .addCase(connectMongoAtlasUri.fulfilled, (state, action) => {
        state.dbStatus = action.payload.status;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
