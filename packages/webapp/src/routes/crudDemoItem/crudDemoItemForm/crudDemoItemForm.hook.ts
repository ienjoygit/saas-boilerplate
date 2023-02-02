import { useEffect } from 'react';

import { useApiForm } from '../../../shared/hooks/useApiForm';
import { CrudDemoItemFormFields, CrudDemoItemFormProps } from './crudDemoItemForm.component';

type UseCrudDemoItemFormProps = Omit<CrudDemoItemFormProps, 'loading'>;

export const useCrudDemoItemForm = ({ error, onSubmit, initialData }: UseCrudDemoItemFormProps) => {
  const form = useApiForm<CrudDemoItemFormFields>({
    defaultValues: {
      name: initialData?.name,
    },
  });

  const { handleSubmit, setApolloGraphQLResponseErrors } = form;

  useEffect(() => {
    if (error) setApolloGraphQLResponseErrors(error.graphQLErrors);
  }, [error, setApolloGraphQLResponseErrors]);

  const handleFormSubmit = handleSubmit((formData: CrudDemoItemFormFields) => onSubmit(formData));

  return { ...form, handleFormSubmit };
};
