import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/api/adoptions";

function getAuthHeaders(getState) {
  const token = getState()?.auth?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const fetchAdoptions = createAsyncThunk(
  "adoptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener historial de adopciones");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createAdoption = createAsyncThunk(
  "adoptions/create",
  async (adoptionData, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(getState),
        body: JSON.stringify(adoptionData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al registrar solicitud de adopción");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAdoption = createAsyncThunk(
  "adoptions/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(getState),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al actualizar el registro de adopción");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAdoption = createAsyncThunk(
  "adoptions/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(getState)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al eliminar el registro de adopción");
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const adoptionsSlice = createSlice({
  name: "adoptions",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdoptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdoptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdoptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdoption.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAdoption.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteAdoption.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  }
});

export default adoptionsSlice.reducer;
