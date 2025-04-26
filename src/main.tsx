import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import App from './App';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticator>
        {({ signOut, user }) =>
          user ? (
            <>
              <button onClick={signOut}>Sign Out</button>
              <App user={user} />
            </>
          ) : (
            <p>Loading user...</p>
          )
        }
      </Authenticator>
    </BrowserRouter>
  </React.StrictMode>
);
