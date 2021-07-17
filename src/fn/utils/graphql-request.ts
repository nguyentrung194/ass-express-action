const graphqurl = require("graphqurl");

export const graphqlRequestUser = (
  query: any,
  variables: any,
  isAdmin: boolean = false,
  token: string | null = null
) =>
  graphqurl.query({
    query,
    endpoint: "https://anime-success.hasura.app/v1/graphql",
    headers: isAdmin
      ? {
        "x-hasura-admin-secret":
          "mF7jWs41nHajkYc9V4tUBWv1BojtJa7cbIXf4pNgEabyFp4vhaEdvGQBAFbC3gkr",
      }
      : {
        authorization: `Bearer ${token}`,
      },
    variables,
  });
