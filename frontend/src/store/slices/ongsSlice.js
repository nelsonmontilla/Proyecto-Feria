import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/api/ongs";

export const fetchOngs = createAsyncThunk("ongs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar las ONG aliadas");
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createOng = createAsyncThunk("ongs/create", async (ongData, { rejectWithValue }) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ongData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Error al registrar la ONG");
    }
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateOng = createAsyncThunk(
  "ongs/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Error al actualizar la ONG");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteOng = createAsyncThunk("ongs/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar la ONG");
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const ongsSlice = createSlice({
  name: "ongs",
  initialState: {
    items: [],
    activeOngId: "all",
    loading: false,
    error: null
  },
  reducers: {
    setActiveOngId: (state, action) => {
      state.activeOngId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOngs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOngs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOngs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOng.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateOng.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteOng.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o.id !== action.payload);
      });
  }
});

export const { setActiveOngId } = ongsSlice.actions;
export default ongsSlice.reducer;
