import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./Home.tsx";
import Inbox from "./inbox.tsx";
import ProfileForm from "./ProfileForm.tsx";

type AppProps = {
  user: {
    username: string;
    attributes?: {
      email?: string;
    };
  };
};

function App({ user }: AppProps) {
  const [profileComplete, setProfileComplete] = useState(false);

  return (
    <main>
      {!profileComplete ? (
        <ProfileForm user={user} onDone={() => setProfileComplete(true)} />
      ) : (
        <Box sx={{ padding: 3 }}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/inbox" element={<Inbox user={user} />} />
          </Routes>
        </Box>
      )}
    </main>
  );
}

export default App;
