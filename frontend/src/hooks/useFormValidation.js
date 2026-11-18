import { useState, useCallback } from "react";

/**
 * Custom Hook #3: useFormValidation
 * Maneja el estado de formularios controlados, validaciones personalizadas,
 * errores por campo y reinicio para las entidades CRUD del sistema.
 */
export function useFormValidation(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue
    }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validateFn) {
        const validationErrors = validateFn(values);
        setErrors(validationErrors);
      }
    },
    [validateFn, values]
  );

  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validateAll = useCallback(() => {
    if (!validateFn) return true;
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [validateFn, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFormValues,
    resetForm,
    validateAll
  };
}
