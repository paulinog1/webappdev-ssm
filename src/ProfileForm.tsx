import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

type Props = {
  user: {
    username: string;
  };
  onDone: () => void;
};

export default function ProfileForm({ user, onDone }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [existingProfile, setExistingProfile] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await client.models.UserProfile.list();
      const match = data.find((p) => p.username === user.username);
      if (match) {
        setExistingProfile(true);
        onDone(); // Skip form if profile already exists
      }
    };
    check();
  }, [user.username]);

  const handleSubmit = async () => {
    await client.models.UserProfile.create({
      username: user.username,
      firstName,
      lastName,
    });
    onDone();
  };

  if (existingProfile) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Complete Your Profile</Typography>
      <TextField
        label="First Name"
        fullWidth
        sx={{ mb: 2 }}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        label="Last Name"
        fullWidth
        sx={{ mb: 2 }}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={!firstName || !lastName}>
        Save Profile
      </Button>
    </Box>
  );
}
