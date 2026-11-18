import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/api/pets";

export const fetchPets = createAsyncThunk("pets/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar el catálogo de mascotas");
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createPet = createAsyncThunk("pets/create", async (petData, { rejectWithValue }) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petData)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "No se pudo registrar la mascota");
    }
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updatePet = createAsyncThunk(
  "pets/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("No se pudo actualizar la mascota");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePetStatus = createAsyncThunk(
  "pets/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("No se pudo cambiar el estado de la mascota");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePet = createAsyncThunk("pets/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo dar de baja / eliminar la mascota");
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const petsSlice = createSlice({
  name: "pets",
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedPet: null
  },
  reducers: {
    setSelectedPet: (state, action) => {
      state.selectedPet = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updatePetStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  }
});

export const { setSelectedPet } = petsSlice.actions;
export default petsSlice.reducer;
