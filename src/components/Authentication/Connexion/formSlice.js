import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
    },
  },
  reducers: {
    updateForm: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setFormErrors: (state, action) => {
      const { name, error } = action.payload;
      state.errors[name] = error; // Mettre à jour les erreurs dans l'état
    },
    resetForm: (state) => {
      state.email = "";
      state.password = "";
      state.errors = {
        email: "",
        password: "",
      }; // Réinitialiser les erreurs
    },
  },
});

export const { updateForm, setFormErrors, resetForm } = formSlice.actions;
export default formSlice.reducer;
