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
    readyBy: a.string().array(),
  }).authorization((allow) => [
    allow.owner(), // Only the owner can manage their messages
  ]),

  UserProfile: a.model({
    id: a.id(),
    username: a.string(),
    firstName: a.string(),
    lastName: a.string(),
  }).authorization((allow) => [
    allow.publicApiKey(),   // (Optional) Public users can read profiles if needed
    allow.authenticated(),  // ✅ Authenticated users can read
    allow.owner(),          // ✅ Owners can edit their own profile
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
