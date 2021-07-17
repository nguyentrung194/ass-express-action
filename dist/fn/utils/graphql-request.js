"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlRequestUser = void 0;
const graphqurl = require("graphqurl");
exports.graphqlRequestUser = (query, variables, isAdmin = false, token = null) => graphqurl.query({
    query,
    endpoint: "https://anime-success.hasura.app/v1/graphql",
    headers: isAdmin
        ? {
            "x-hasura-admin-secret": "mF7jWs41nHajkYc9V4tUBWv1BojtJa7cbIXf4pNgEabyFp4vhaEdvGQBAFbC3gkr",
        }
        : {
            authorization: `Bearer ${token}`,
        },
    variables,
});
//# sourceMappingURL=graphql-request.js.map