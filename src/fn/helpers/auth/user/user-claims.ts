export const userCustomClaims = (userId: string, id: string) => ({
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user"],
    "x-hasura-user-id": userId,
    "x-hasura-user-id-on-db": id,
  },
});
