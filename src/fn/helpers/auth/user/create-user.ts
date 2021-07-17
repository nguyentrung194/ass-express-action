import { graphqlRequestUser } from "../../../utils/graphql-request";

export class Variables {
  object:
    | {
        displayName: string;
        email: string;
        roles: string;
        avatarUrl: string;
        phones: Array<{ local: string; phone: string }>;
        country: string;
        dialCode: string;
        countryCode: string;
        address: Array<{ city: string; district: string; commune: string }>;
      }
    | undefined;
}

export const createUser = (variables: Variables) =>
  graphqlRequestUser(
    /* GraphQL */ `
      mutation insert_users($object: users_insert_input!) {
        insert_users(objects: [$object]) {
          returning {
            id
          }
        }
      }
    `,
    variables,
    true
  );
