import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { BrowserRouter } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticator loginMechanisms={['username']} hideSignUp={false}>
        {({ signOut, user }) => (
          user ? <App /> : null
        )}
      </Authenticator>
    </BrowserRouter>
  </React.StrictMode>
);
