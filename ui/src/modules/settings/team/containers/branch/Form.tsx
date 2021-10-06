import React from 'react';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import Form from '../../components/branch/Form';
import { mutations, queries } from '../../graphql';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { Branch } from '../../types';

type Props = {
  branch?: Branch;
  closeModal: () => void;
};

const FormContainer = (props: Props) => {
  const { data, loading } = useQuery(gql(queries.branches), {
    variables: { depthType: 'parent' },
    fetchPolicy: 'network-only'
  });

  if (loading) {
    return <div>...</div>;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    object,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object._id ? mutations.branchesEdit : mutations.branchesAdd}
        refetchQueries={[
          {
            query: gql(queries.branches)
          }
        ]}
        variables={values}
        isSubmitted={isSubmitted}
        type="submit"
        callback={callback}
        successMessage={`You successfully ${
          object._id ? 'updated' : 'added'
        } a ${name}`}
      />
    );
  };

  return (
    <Form
      parentBranches={data.branches}
      {...props}
      renderButton={renderButton}
    />
  );
};

export default FormContainer;
