import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Message: a.model({
    sender: a.string(),
    senderDisplayName: a.string(), // 👈 New
    recipients: a.string().array(),
    subject: a.string(),
    body: a.string(),
    timestamp: a.datetime(),
    archived: a.boolean(),
  })
  .authorization((allow) => [allow.owner()]),
  

  UserProfile: a
    .model({
      username: a.string(),
      firstName: a.string(),
      lastName: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
