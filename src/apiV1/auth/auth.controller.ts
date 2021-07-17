import { Request, Response } from "express";
import { createUser } from "../../fn/helpers/auth/user/create-user";
import { userCustomClaims } from "../../fn/helpers/auth/user/user-claims";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "ani-success",
    clientEmail: "firebase-adminsdk-9xq74@ani-success.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMmVBAAcsXkir+\nh49s1+G4NgtTOcc1mUM/x6D87dI/Oh2pWxenrP145i7DK1CLO6LRaqmbw2KNniti\nBkVViIY8yDBMT8mSgLgnodW8CPn1n7MDmOGoKJxBQkx/O8p1rQiWvdvhyZQzKl2v\n30aX2U9gp+SnjlJIMPFNzvgmbzHN+BlEnKKyxl1sDugStA0Caor+0imTYuIVjWVI\nD3f+WasMC/EOMTCfmFDNbKhl1UOtWILYM07NIasoI1nhoLftrp8WmEx7G1lU7IiX\nlXiqF/Zg/zzqpz8MelQs9TLitevldK+YO7q+EPoXbPkob08bv5Kg69UC4p1kbIPu\nPGfZFvz9AgMBAAECggEAF+ZK1QdAmZLF+fCM5Pp8z/9kKEcmCZFLJT6lBBalyiP4\nRgmxhDE1dLNyv/Kl2HXRaaQLhvn2X7ObvrobzEeD4sLBvZBObBIkMOD7LhlgVXxf\ntWpc5b9ErWzYsb4iwsdBKxangkMBUE7BHeO3g9JrLs+96oK6AtvQvDWSkC7KAxSj\n51EG0WVYq3OZOil5BwfNHpmtjBUPLSpMb4FVyRlUXPMn7zfNUdOJfTKJXf+nb53q\n/h+4FVoelYCXzMYzZXH18F1RIz4jQNMK5a5sPgekum2aQkdlLDC565GfUfihgvW9\n5RH+W6evgd5FQJ+B8WynRLP2wmij6dBqPh6witTWAQKBgQD8zgQGRg1svyg3ZspN\nDtNVAs/V/vO7V5hzqQfZbYOG8wwQvIYUrAMAUTaiHCq8oJbzWhcnnC4GyTdo2afo\nSOinnqXEk21Kb14W89PRjWmoziVZ0FgoiS0iljGEb0hLJxqBA5sz0To2nD5PkUHj\nVDUL8LJfuETxCRcYOVMK42RbAQKBgQDPL1Iy1ygPIRigdg0ffVGvH8eq8yqKXng+\nHy33IkNkCtZH3sb/NJy198EZcpzaTm/pvu0lbujGtai71SBZJOMDYQhM3Vq+FxaA\n/3R5zWpHBFooIH180dsCVAzVzoD08UXfO9SyJDKIxoNpgZ3cX86WOd9a9jMwg2JC\ngeauuEoN/QKBgA+Gs5aTDNYF83lblccfxvjsoEkbTGrQGWvZEMNYx4AtQytv+Kgi\nXFjTpBBWvIUzM7IkcVGcdPMzvnRxEa/hcnCA/NtS1p6Asn2kYfj3v2p/pqmacx+i\nNSRvpwDkOMNs1mLgDtMi4XljJSyL1kkY7d0a3kmkro9DKKjzNFdx2cMBAoGASCKv\nuefTmMDrNCMmGoqlgBXOjSSw8RBHSUnN1TfmwtRLGybjnkORNIIYh2WyWwfoSzgg\nlWHyRg1FvHBOHPuM1sZX/3sqdvjO6wcGZMoycJuBUGtPhcADQuJEvcRyfdXrf/fy\n7DtSJPEJHBj2/52T7hYkQCVsWT3FXmagDME5d3kCgYABzxZGyyAaI59ceyAigZ0M\n6B0yVSAOSn8Su+3qRQyeIDMThv+IOYRhruf/bVWSvV7FRlidC5EhT3XHT2vKRLol\nW0ZcJCsBCGiYCdYkyx31R9W13jc/iwcObPIescK5/Fa9qtGb4ZZzwtx1yl9pHqs1\na9dAcHux+mIEQkcYEkijIQ==\n-----END PRIVATE KEY-----\n",
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
