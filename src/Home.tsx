import { Link } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import './Home.css';

function Home() {
  const { signOut, user } = useAuthenticator();

  return (
    <Box className="home-container">
      {/* Welcome Text + Logout */}
      <Container className="home-header">
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h4">
            Welcome ({user?.username || "Guest"})
          </Typography>
        </Box>

        <Button
          className="sign-out-btn"
          variant="text"
          onClick={signOut}
        >
          Logout
        </Button>
      </Container>

      <br />

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={4} justifyContent="center">
        <Button
          variant="contained"
          component={Link}
          to="/inbox"
          className="nav-button"
        >
          INBOX
        </Button>
        <Button variant="contained" className="nav-button">
          ARCHIVES
        </Button>
      </Stack>
    </Box>
  );
}

export default Home;
