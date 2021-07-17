"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_user_1 = require("../../fn/helpers/auth/user/create-user");
const user_claims_1 = require("../../fn/helpers/auth/user/user-claims");
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "ani-success",
        clientEmail: "firebase-adminsdk-9xq74@ani-success.iam.gserviceaccount.com",
        privateKey: process.env.PROMARYKEY,
    }),
});
class UserSetupController {
    constructor() {
        this.userSetup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`/userSetup start`);
            console.log(req.body);
            try {
                const { input: { token, displayName, roles, avatarUrl, country, countryCode, phones, dialCode, address, }, } = req.body.input;
                // decode user from token
                const user = yield admin.auth().verifyIdToken(token);
                console.log(user);
                const userId = user.uid;
                const email = user.email;
                console.log(`User ID: ${userId} and Email: ${email}`);
                // create user on backend
                console.log(`Start create user account`);
                const userInfor = yield create_user_1.createUser({
                    object: {
                        email,
                        displayName,
                        roles,
                        avatarUrl,
                        country,
                        countryCode,
                        phones,
                        dialCode,
                        address,
                    },
                });
                // set custom claims for this user on firebase auth
                const id = userInfor.data.insert_users.returning[0].id;
                console.log(`Success create user account with ID: ${id}`);
                const customClaims = user_claims_1.userCustomClaims(userId, id);
                console.log(`Setting custom claims`);
                yield admin.auth().setCustomUserClaims(userId, customClaims);
                return res.status(200).json({
                    status: "success",
                    statusCode: 200,
                    message: "Ok",
                });
            }
            catch (error) {
                console.log(`/userSetup end with error`);
                console.error(error);
                return res
                    .status(400)
                    .json({ status: "fail", statusCode: 400, message: error });
            }
        });
    }
}
exports.default = UserSetupController;
//# sourceMappingURL=auth.controller.js.map