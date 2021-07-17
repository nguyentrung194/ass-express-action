import { Request, Response } from 'express';
import { createUser } from '../../fn/helpers/auth/user/create-user';
import { userCustomClaims } from '../../fn/helpers/auth/user/user-claims';
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "fashion-trend-store",
    clientEmail: "firebase-adminsdk-yvxba@fashion-trend-store.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCggJW9Jx4N3PW3\nVzlkP/sxBucGHw5+ivEUS90RTSjWKMQzUbUrKRVf2TGyCnTPxGf4m9FWqN2bjr4s\nrZHo7+JidCgTQWr4//1BoMEskenUdTnirBuICPHLEdLyQ00V9upUaSOc9BvV5tS5\nu+AbLo7yn5lfZRUuJF//7oeHNtcXm6LYcAa/sCGl7LlRISluEDSyANBgSg3PhbBb\nzGkwtxQGl7MgdBD71UDgBJiZCBXlqtqv6VflGJUPYBkCmipS33Z6qMRDwCwxF63I\nA7s7CMo7MXn/qW7WjlaypxyBQ7VfUyoAst1qhENQ6aDt1k1MizR4KXKujVih74Gy\nDo8EnfFVAgMBAAECggEAIcKyXImCIZ3hBJnhDVSE+IzQYwH82ULOD3weqdE+Xf/Q\nt0/ASS4Y3CKyOJZI+FwCl7Fk4PLfvGUT3Q98cdAloRp4RIad4vbrtVaEU6T0l7c5\nwBN+LgjdnV6oLcPYzt4zb6J29oCFa2Kky9W4P9d1A5VtHDsFr8FAfTPWB6vSJhmG\nGaeCdojENCG6VVp2yLXovdnYm86D5kDaCotQ6bXK0rIoCcwr3PxfXZf8C14KVbt9\n9g6Mz5BiY3PMR7iqK9aHiCOHZcMtcH1I6s/M+fRMnWiJXJCqzzsQnfqgPfhpSTlW\nOUXDE0Ovh3hBjFq9wkBHtOI+ah8Dicd+1lS+ZrSjcQKBgQDS3I8meWfQs7kbGGzT\nCwcoVIP6F6UAGoY6qieXKX0LRZUqwqmQNrnTTX6YhZCkRKxfFX4CDRcPsdAsZVuG\nxs2kLwzjlCGFPDtf4uDKoDmBsRI7+eHZHHLC4elGaOHnzpzeSEXiXsip2Yl9i1O8\nk2u3RZW9IVVaDqXH2oZrR4eSMQKBgQDC3Eh/aNx8g7oAANtxzGWER6NCo+XzAI/A\nlOnE5MnUhkDDUcuRXU6jnjUFT6EHZm9bFwEgxre+306Dr3yVP2zVaE3Pmt7QfImj\nnELyDsqvlENuamT7aqynTx1LUyjiUe1meVPq98YdP99A4wIkn7x+qC5DCxiWsNVJ\nSfUgQMCEZQKBgQCMiA6n17YG9CDkHA07QlhM2rby0RtYzFS1eH3WUwJRpthZnU8h\nHDgQyc8bm7jgohw3ar2GZG8AOMPDMvIjCxA24ly2uBz3DUONDko/ATYSZ479hfat\nmjYqCCJOmMwmkB8gTg61ZfJasO7fSyJNxfq+NJQtbq/Ry31ViyCXEx8ZoQKBgGW4\n4Q/CCffmPB7sU6JgdU5Mp2mObeghDuoV0sM6PDJ5sy1DceV8tCSt3jfbjdBzJQaE\nR854bktx/2a3IW44IfR18sjBrDdiC+ghFsGN/zkRSPJHEFg/I8pjfoNn8hvTcP7h\nr3Elz4JNaZpR5zh/OsNTwHK3RCrGPVF5DkG8C8QRAoGBALVc/ysBCQ7hwOe+jowx\n/803P+C/GFzryH3D26B5WpNz9Tr7EynVG+iVaMpApopQ0XmB8SQp5GYAfyiNMiIt\nDrpFlduyntnbz3hf/m/wdP8BJlkvwdx9MgLEuNW5Q7SN9Ec+GvDKZNyKe0buF74e\nhlVr24D2amq+4UWsUVWkGcgP\n-----END PRIVATE KEY-----\n"
  })
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
