import { snackbarActions } from '../../../modules/snackbar';
import { useAsyncDispatch } from '../../utils/reduxSagaPromise';

export const useSnackbar = () => {
  const dispatch = useAsyncDispatch();

  const showMessage = async (message: string | null) => {
    await dispatch(snackbarActions.showMessage(message));
  };

  return { showMessage };
};
