"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.Variables = void 0;
const graphql_request_1 = require("../../../utils/graphql-request");
class Variables {
}
exports.Variables = Variables;
exports.updateUser = (token, variables) => graphql_request_1.graphqlRequestUser(
/* GraphQL */ `
      mutation updateUser($userId: uuid) {
        update_users(where: { id: { _eq: $userId } }) {
          affected_rows
          returning {
            id
          }
        }
      }
    `, variables, false, token);
//# sourceMappingURL=update-user.js.map