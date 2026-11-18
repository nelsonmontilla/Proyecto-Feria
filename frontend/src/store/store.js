import { configureStore } from "@reduxjs/toolkit";
import petsReducer from "./slices/petsSlice";
import ongsReducer from "./slices/ongsSlice";
import adoptionsReducer from "./slices/adoptionsSlice";
import contactsReducer from "./slices/contactsSlice";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petsReducer,
    ongs: ongsReducer,
    adoptions: adoptionsReducer,
    contacts: contactsReducer,
    ui: uiReducer
  }
});
