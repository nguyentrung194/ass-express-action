import { graphqlRequestUser } from "../../../utils/graphql-request";

export class Variables {
  userId: string | undefined;
}

export const updateUser = (token: string, variables: Variables) =>
  graphqlRequestUser(
    /* GraphQL */ `
      mutation updateUser($userId: uuid) {
        update_users(where: { id: { _eq: $userId } }) {
          affected_rows
          returning {
            id
          }
        }
      }
    `,
    variables,
    false,
    token
  );
