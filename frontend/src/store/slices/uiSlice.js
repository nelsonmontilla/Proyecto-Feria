import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notifications: [],
    adoptionModalPet: null,
    detailModalPet: null,
    activeRole: "adoptante"
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: action.payload.id || Date.now() + Math.random(),
        type: action.payload.type || "success",
        title: action.payload.title || "Animal Advisor",
        message: action.payload.message
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    openAdoptionModal: (state, action) => {
      state.adoptionModalPet = action.payload;
    },
    closeAdoptionModal: (state) => {
      state.adoptionModalPet = null;
    },
    openDetailModal: (state, action) => {
      state.detailModalPet = action.payload;
    },
    closeDetailModal: (state) => {
      state.detailModalPet = null;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    }
  }
});

export const {
  addNotification,
  removeNotification,
  openAdoptionModal,
  closeAdoptionModal,
  openDetailModal,
  closeDetailModal,
  setActiveRole
} = uiSlice.actions;

export default uiSlice.reducer;
