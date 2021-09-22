import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Bulk from 'modules/common/components/Bulk';
import { Alert, withProps } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '../../common/types';
import { DefaultColumnsConfigQueryResponse } from '../../settings/properties/types';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import {
  AddMutationResponse,
  IAutomationDoc,
  ListQueryVariables,
  MainQueryResponse,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../types';

type Props = {
  queryParams?: any;
};

type FinalProps = {
  automationsMainQuery: MainQueryResponse;
  automationsListConfigQuery: DefaultColumnsConfigQueryResponse;
} & Props &
  IRouterProps &
  RemoveMutationResponse &
  AddMutationResponse;

type State = {
  loading: boolean;
};

class ListContainer extends React.Component<FinalProps, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  refetchWithDelay = () => {
    this.timer = setTimeout(() => {
      this.props.automationsMainQuery.refetch();
    }, 5500);
  };

  render() {
    const {
      automationsMainQuery,
      automationsRemove,
      addAutomationMutation,
      history
    } = this.props;

    const addAutomation = () => {
      addAutomationMutation({
        variables: {
          name: 'Your automation title',
          status: 'draft',
          triggers: [],
          actions: []
        }
      })
        .then(data => {
          history.push(`/automations/details/${data.data.automationsAdd._id}`);
          Alert.success(`You successfully created an automation`);
        })

        .catch(error => {
          Alert.error(error.message);
        });
    };

    const removeAutomations = ({ automationIds }, emptyBulk) => {
      automationsRemove({
        variables: { automationIds }
      })
        .then(() => {
          emptyBulk();
          Alert.success(
            'You successfully deleted a automation. The changes will take a few seconds',
            4500
          );

          this.refetchWithDelay();
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';
    const { list = [], totalCount = 0 } =
      automationsMainQuery.automationsMain || {};

    const updatedProps = {
      ...this.props,
      totalCount,
      searchValue,
      automations: list,
      loading: automationsMainQuery.loading || this.state.loading,
      addAutomation,
      removeAutomations,
      refetch: this.refetchWithDelay
    };

    const automationsList = props => {
      return <List {...updatedProps} {...props} />;
    };

    return (
      <Bulk
        content={automationsList}
        refetch={this.props.automationsMainQuery.refetch}
      />
    );
  }
}

const generateParams = ({ queryParams }) => {
  return {
    ...generatePaginationParams(queryParams),
    segment: queryParams.segment,
    tag: queryParams.tag,
    brand: queryParams.brand,
    ids: queryParams.ids,
    searchValue: queryParams.searchValue,
    sortField: queryParams.sortField,
    sortDirection: queryParams.sortDirection
      ? parseInt(queryParams.sortDirection, 10)
      : undefined
  };
};

const getRefetchQueries = (queryParams?: any) => {
  return [
    {
      query: gql(queries.automationsMain),
      variables: { ...generateParams({ queryParams }) }
    }
  ];
};

export default withProps<Props>(
  compose(
    graphql<Props, MainQueryResponse, ListQueryVariables>(
      gql(queries.automationsMain),
      {
        name: 'automationsMainQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    // mutations
    graphql<{}, AddMutationResponse, IAutomationDoc>(
      gql(mutations.automationsAdd),
      {
        name: 'addAutomationMutation',
        options: () => ({
          refetchQueries: ['automations', 'automationsMain', 'automationDetail']
        })
      }
    ),
    graphql<Props, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.automationsRemove),
      {
        name: 'automationsRemove',
        options: ({ queryParams }) => ({
          refetchQueries: getRefetchQueries(queryParams)
        })
      }
    )
  )(withRouter<IRouterProps>(ListContainer))
);
