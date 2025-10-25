import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Custom hook to easily trigger toast notifications.
 * @returns {object} An object containing functions to show success, error, and info toasts.
 */
const useToast = () => {
  const { addToast } = useAppContext();

  const showSuccessToast = useCallback((title, message) => {
    addToast(title, message, 'success');
  }, [addToast]);

  const showErrorToast = useCallback((title, message) => {
    addToast(title, message, 'danger');
  }, [addToast]);

  const showInfoToast = useCallback((title, message) => {
    addToast(title, message, 'info');
  }, [addToast]);

  return { showSuccessToast, showErrorToast, showInfoToast };
};

export default useToast;