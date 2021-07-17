"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.Variables = void 0;
const graphql_request_1 = require("../../../utils/graphql-request");
class Variables {
}
exports.Variables = Variables;
exports.createUser = (variables) => graphql_request_1.graphqlRequestUser(
/* GraphQL */ `
      mutation insert_users($object: users_insert_input!) {
        insert_users(objects: [$object]) {
          returning {
            id
          }
        }
      }
    `, variables, true);
//# sourceMappingURL=create-user.js.map