import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./Home.tsx"; //  Import Home component
import Inbox from "./inbox.tsx"; //  Import Inbox component

function App() {
  return (
    <main>
      {/* Main content changes with routing */}
      <Box sx={{ padding: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/inbox" element={<Inbox />} /> {/* Inbox page */}
        </Routes>
      </Box>
    </main>
  );
}

export default App;
