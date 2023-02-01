import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';

import { useApiForm } from '../../../hooks/useApiForm';
import { useAuth } from '../../../hooks/useAuth/useAuth';

import { useSnackbar } from '../../../../modules/snackbar';
import { authUpdateUserProfileMutation } from './editProfileForm.graphql';
import { UpdateProfileFormFields } from './editProfileForm.types';

export const useEditProfileForm = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const snackbar = useSnackbar();
  const form = useApiForm<UpdateProfileFormFields>({
    defaultValues: {
      firstName: currentUser?.firstName ?? '',
      lastName: currentUser?.lastName ?? '',
    },
  });

  const { handleSubmit, setApolloGraphQLResponseErrors } = form;

  const [commitUpdateUserMutation, { loading }] = useMutation(authUpdateUserProfileMutation, {
    onCompleted: () => {
      snackbar.showMessage(
        intl.formatMessage({
          defaultMessage: 'Personal data successfully changed.',
          id: 'Auth / Update profile/ Success message',
        })
      );
    },
    onError: (error) => {
      setApolloGraphQLResponseErrors(error.graphQLErrors);
    },
  });

  const handleUpdate = handleSubmit((input: UpdateProfileFormFields) => {
    commitUpdateUserMutation({
      variables: {
        input,
      },
    });
  });

  return { ...form, loading, handleUpdate };
};