import assert from "node:assert/strict";
import test from "node:test";
import User from "../models/user.js";
import OTP from "../models/OTP.js";
import Profile from "../models/profile.js";
import { signup, verifyOTP } from "../controllers/auth.js";

const originalMethods = {
  userFindOne: User.findOne,
  userUpdateOne: User.updateOne,
  userCreate: User.create,
  otpFindOne: OTP.findOne,
  otpDeleteOne: OTP.deleteOne,
  profileCreate: Profile.create,
};

const restoreMethods = (t) => {
  t.after(() => {
    User.findOne = originalMethods.userFindOne;
    User.updateOne = originalMethods.userUpdateOne;
    User.create = originalMethods.userCreate;
    OTP.findOne = originalMethods.otpFindOne;
    OTP.deleteOne = originalMethods.otpDeleteOne;
    Profile.create = originalMethods.profileCreate;
  });
};

const makeResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const makeOtp = ({
  email = "student@example.test",
  otp = "123456",
  expiresAt = new Date(Date.now() + 60_000),
  verifiedAt = null,
} = {}) => ({
  email,
  otp,
  expiresAt,
  verifiedAt,
  saved: false,
  async save() {
    this.saved = true;
  },
});

const makeSignupRequest = (email = "student@example.test") => ({
  body: {
    firstName: "Test",
    lastName: "Student",
    email,
    password: "TestPassword1",
    confirmPassword: "TestPassword1",
    accountType: "Student",
  },
});

test("signup creates a verified account only for the matching verified email", async (t) => {
  restoreMethods(t);
  const verifiedOtp = makeOtp({ verifiedAt: new Date() });
  let createdUser;

  OTP.findOne = (filter) => ({
    sort: async () => (filter.email === verifiedOtp.email ? verifiedOtp : null),
  });
  User.findOne = async () => null;
  Profile.create = async () => ({ _id: "profile-id" });
  User.create = async (user) => {
    createdUser = user;
    return { toObject: () => ({ ...user }) };
  };
  OTP.deleteOne = async () => ({ deletedCount: 1 });

  const response = makeResponse();
  await signup(makeSignupRequest(" STUDENT@example.test "), response);

  assert.equal(response.statusCode, 201);
  assert.equal(createdUser.email, verifiedOtp.email);
  assert.equal(createdUser.isVerified, true);
});

test("signup rejects a different email and creates no account", async (t) => {
  restoreMethods(t);
  const verifiedOtp = makeOtp({ verifiedAt: new Date() });
  let profileCreated = false;
  let userCreated = false;

  OTP.findOne = (filter) => ({
    sort: async () => (filter.email === verifiedOtp.email ? verifiedOtp : null),
  });
  User.findOne = async () => null;
  Profile.create = async () => {
    profileCreated = true;
    return { _id: "profile-id" };
  };
  User.create = async () => {
    userCreated = true;
  };

  const response = makeResponse();
  await signup(makeSignupRequest("other@example.test"), response);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.code, "EMAIL_NOT_VERIFIED");
  assert.equal(profileCreated, false);
  assert.equal(userCreated, false);
});

test("signup rejects when no valid verified OTP exists", async (t) => {
  restoreMethods(t);
  OTP.findOne = () => ({ sort: async () => null });
  User.findOne = async () => null;

  const response = makeResponse();
  await signup(makeSignupRequest(), response);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.code, "EMAIL_NOT_VERIFIED");
});

test("OTP verification rejects an invalid code without updating the account", async (t) => {
  restoreMethods(t);
  const latestOtp = makeOtp();
  let userUpdated = false;
  OTP.findOne = () => ({ sort: async () => latestOtp });
  User.findOne = () => ({ select: async () => ({ _id: "user-id" }) });
  User.updateOne = async () => {
    userUpdated = true;
    return { matchedCount: 1 };
  };

  const response = makeResponse();
  await verifyOTP(
    { body: { email: latestOtp.email, otp: "654321" } },
    response
  );

  assert.equal(response.statusCode, 400);
  assert.equal(userUpdated, false);
  assert.equal(latestOtp.saved, false);
});

test("OTP verification rejects an expired code", async (t) => {
  restoreMethods(t);
  const latestOtp = makeOtp({ expiresAt: new Date(Date.now() - 1_000) });
  let userLookedUp = false;
  OTP.findOne = () => ({ sort: async () => latestOtp });
  User.findOne = () => {
    userLookedUp = true;
    return { select: async () => ({ _id: "user-id" }) };
  };

  const response = makeResponse();
  await verifyOTP(
    { body: { email: latestOtp.email, otp: latestOtp.otp } },
    response
  );

  assert.equal(response.statusCode, 400);
  assert.equal(userLookedUp, false);
  assert.equal(latestOtp.saved, false);
});

test("OTP verification persists verification for an existing matching user", async (t) => {
  restoreMethods(t);
  const latestOtp = makeOtp();
  let updatedFilter;
  let update;
  OTP.findOne = () => ({ sort: async () => latestOtp });
  User.findOne = () => ({ select: async () => ({ _id: "user-id" }) });
  User.updateOne = async (filter, updateDoc) => {
    updatedFilter = filter;
    update = updateDoc;
    return { matchedCount: 1 };
  };

  const response = makeResponse();
  await verifyOTP(
    { body: { email: " STUDENT@example.test ", otp: latestOtp.otp } },
    response
  );

  assert.equal(response.statusCode, 200);
  assert.deepEqual(updatedFilter, {
    _id: "user-id",
    email: "student@example.test",
  });
  assert.deepEqual(update, { $set: { isVerified: true } });
  assert.ok(latestOtp.verifiedAt instanceof Date);
  assert.equal(latestOtp.saved, true);
});

test("OTP verification does not report success when an existing user update misses", async (t) => {
  restoreMethods(t);
  const latestOtp = makeOtp();
  OTP.findOne = () => ({ sort: async () => latestOtp });
  User.findOne = () => ({ select: async () => ({ _id: "user-id" }) });
  User.updateOne = async () => ({ matchedCount: 0 });

  const response = makeResponse();
  await verifyOTP(
    { body: { email: latestOtp.email, otp: latestOtp.otp } },
    response
  );

  assert.equal(response.statusCode, 409);
  assert.equal(latestOtp.saved, false);
});

test("OTP verification succeeds before registration when no user exists", async (t) => {
  restoreMethods(t);
  const latestOtp = makeOtp();
  OTP.findOne = () => ({ sort: async () => latestOtp });
  User.findOne = () => ({ select: async () => null });
  let userUpdated = false;
  User.updateOne = async () => {
    userUpdated = true;
    return { matchedCount: 0 };
  };

  const response = makeResponse();
  await verifyOTP(
    { body: { email: latestOtp.email, otp: latestOtp.otp } },
    response
  );

  assert.equal(response.statusCode, 200);
  assert.equal(latestOtp.saved, true);
  assert.equal(userUpdated, false);
});
