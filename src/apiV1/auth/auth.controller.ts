import { Request, Response } from "express";
import { createUser } from "../../fn/helpers/auth/user/create-user";
import { userCustomClaims } from "../../fn/helpers/auth/user/user-claims";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "ani-success",
    clientEmail: "firebase-adminsdk-9xq74@ani-success.iam.gserviceaccount.com",
    privateKey: process.env.PROMARYKEY,
  }),
});

export default class UserSetupController {
  public userSetup = async (req: Request, res: Response): Promise<any> => {
    console.log(`/userSetup start`);
    console.log(req.body);
    try {
      const {
        input: {
          token,
          displayName,
          roles,
          avatarUrl,
          country,
          countryCode,
          phones,
          dialCode,
          address,
        },
      } = req.body.input;

      // decode user from token
      const user = await admin.auth().verifyIdToken(token);
      console.log(user);
      const userId = user.uid;
      const email = user.email as string;

      console.log(`User ID: ${userId} and Email: ${email}`);
      // create user on backend
      console.log(`Start create user account`);
      const userInfor = await createUser({
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
      const customClaims = userCustomClaims(userId, id);
      console.log(`Setting custom claims`);
      await admin.auth().setCustomUserClaims(userId, customClaims);

      return res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Ok",
      });
    } catch (error) {
      console.log(`/userSetup end with error`);
      console.error(error);
      return res
        .status(400)
        .json({ status: "fail", statusCode: 400, message: error });
    }
  };
}
