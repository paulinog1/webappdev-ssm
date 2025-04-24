import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Message: a
    .model({
      sender: a.string(),
      recipients: a.array(a.string()),
      content: a.string(),
      timestamp: a.datetime(),
      archived: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]), // Only owner can CRUD their messages
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
