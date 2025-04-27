import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Message: a.model({
    sender: a.string(),
    senderDisplayName: a.string(),
    recipients: a.string().array(),
    subject: a.string(),
    body: a.string(),
    timestamp: a.datetime(),
    archived: a.boolean(),
    readBy: a.string().array(),
  }).authorization((allow) => [
    allow.owner(),
  ]),

  UserProfile: a.model({
    id: a.id(),
    username: a.string(),
    firstName: a.string(),
    lastName: a.string(),
  }).authorization((allow) => [
    allow.authenticated(), // ✅ Allow signed-in users to read profiles
    allow.owner(),          // ✅ Allow users to modify their own profile
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
