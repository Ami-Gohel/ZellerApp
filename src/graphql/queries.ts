import { gql } from '@apollo/client';

export const LIST_ZELLER_CUSTOMERS = gql`
  query ListZellerCustomers(
    $filter: TableZellerCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZellerCustomers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;

export const GET_ZELLER_CUSTOMER = gql`
  query GetZellerCustomer($id: String!) {
    getZellerCustomer(id: $id) {
      id
      name
      email
      role
    }
  }
`;
