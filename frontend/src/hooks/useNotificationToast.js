import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, removeNotification } from "../store/slices/uiSlice";

/**
 * Custom Hook #5: useNotificationToast
 * Conecta con el estado global de Redux (uiSlice) para disparar alertas
 * visuales auto-descartables en cada operación CRUD.
 */
export function useNotificationToast() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.ui.notifications);

  const notify = useCallback(
    ({ title = "Animal Advisor", message, type = "success", duration = 4000 }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      dispatch(addNotification({ id, title, message, type }));

      setTimeout(() => {
        dispatch(removeNotification(id));
      }, duration);
    },
    [dispatch]
  );

  const dismiss = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return {
    notifications,
    notify,
    dismiss
  };
}
