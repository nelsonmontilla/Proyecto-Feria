import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  registerUser,
  logout,
  clearAuthError
} from "../store/slices/authSlice";

/**
 * Custom Hook #7: useAuth
 * Gestiona la sesión del usuario, separación de roles (Administrador, ONG y Usuario Normal)
 * y acciones de inicio/cierre de sesión conectadas a Redux.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error, dbStatus } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === "admin";
  const isOng = user?.role === "ong" || user?.role === "admin";
  const isNormalUser = !user || user?.role === "user";

  const login = useCallback(
    async (credentials) => {
      return await dispatch(loginUser(credentials)).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData) => {
      return await dispatch(registerUser(userData)).unwrap();
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    dbStatus,
    isAuthenticated,
    isAdmin,
    isOng,
    isNormalUser,
    login,
    register,
    signOut,
    resetError
  };
}
