import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/api/pets";

function getAuthHeaders(getState) {
  const token = getState()?.auth?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const fetchPets = createAsyncThunk("pets/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar el catálogo de mascotas");
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createPet = createAsyncThunk(
  "pets/create",
  async (petData, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(getState),
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
  }
);

export const updatePet = createAsyncThunk(
  "pets/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(getState),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "No se pudo actualizar la mascota");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePetStatus = createAsyncThunk(
  "pets/updateStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "No se pudo cambiar el estado de la mascota");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePet = createAsyncThunk(
  "pets/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(getState)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "No se pudo dar de baja / eliminar la mascota");
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
