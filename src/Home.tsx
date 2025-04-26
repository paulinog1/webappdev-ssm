import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

type HomeProps = {
  user: {
    username: string;
  };
};

export default function Home({ user }: HomeProps) {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await client.models.UserProfile.list();
      const profile = data.find((p) => p?.username === user.username);
      if (profile && profile.firstName) {
        setFirstName(profile.firstName ?? ""); // fallback if missing
      }
    };
    loadProfile();
  }, [user.username]);

  return (
    <Box
      sx={{
        backgroundColor: "skyblue",
        maxWidth: "800px",
        padding: 4,
        borderRadius: 3,
        margin: "0 auto",
        textAlign: "center",
        marginTop: 6,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome back{firstName ? `, ${firstName}` : ""}!
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button component={Link} to="/inbox" variant="contained">
          Inbox
        </Button>
        <Button component={Link} to="/archive" variant="contained">
          Archives
        </Button>
      </Stack>
    </Box>
  );
}
