import { useEffect, useState } from "react";
import {
  Box, Button, List, ListItem, ListItemText, Typography, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

type InboxProps = {
  user: {
    username: string;
    attributes?: {
      email?: string;
    };
  };
};

export default function Inbox({ user }: InboxProps) {
  const [messages, setMessages] = useState<Schema["Message"]["type"][]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [draft, setDraft] = useState({
    recipient: "",
    subject: "",
    body: "",
  });
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string } | null>(null);

  // Fetch user profile and messages
  const loadMessagesAndProfile = async () => {
    try {
      // List all profiles
      const { data: profiles } = await client.models.UserProfile.list();
      const profile = profiles.find((p) => p.username === user.username);
  
      console.log("Loaded profile:", profile);
  
      if (profile) {
        setUserProfile({ firstName: profile.firstName ?? "", lastName: profile.lastName ?? "" });
      }
  
      const { data: messagesData } = await client.models.Message.list();
      const received = messagesData.filter(
        (msg) => (msg.recipients ?? []).includes(user.username) && !msg.archived
      );
      const sent = messagesData.filter(
        (msg) => msg.sender === user.username && !msg.archived
      );
      setMessages([...received, ...sent]);
    } catch (error) {
      console.error("Failed to load profile or messages:", error);
    }
  };
  

  useEffect(() => {
    loadMessagesAndProfile();
  }, [user.username]);

  const sendMessage = async () => {
    try {
      // 1. Look up the recipient user profile by first name
      const { data: profiles } = await client.models.UserProfile.list();
      console.log("All profiles fetched:", profiles);
      
      const recipientProfile = profiles.find((p) => 
        p.firstName?.toLowerCase() === draft.recipient.toLowerCase()
      );
  
      if (!recipientProfile) {
        alert("Recipient not found!");
        return;
      }
  
      // 2. Use the recipient's UUID (username) for sending
      await client.models.Message.create({
        sender: user.username ?? "",
        senderDisplayName: userProfile
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : user.username ?? "",
        recipients: [recipientProfile.username], // <<<< use the UUID!
        subject: draft.subject,
        body: draft.body,
        timestamp: new Date().toISOString(),
        archived: false,
      });
  
      setDraft({ recipient: "", subject: "", body: "" });
      setIsComposeOpen(false);
  
      await loadMessagesAndProfile();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  

  const deleteMessage = async (id: string) => {
    try {
      await client.models.Message.update({ id, archived: true });
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Inbox
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setIsComposeOpen(true)}>
        Compose
      </Button>

      <List sx={{ marginTop: 2 }}>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            sx={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              marginBottom: 1,
              borderRadius: "5px",
              cursor: "pointer",
            }}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteMessage(msg.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <MailOutlineIcon sx={{ marginRight: 1, color: "blue" }} />
            <ListItemText
              primary={msg.subject ?? "No Subject"}
              secondary={
                <>
                  From: {msg.senderDisplayName ?? "Unknown"} | 
                  To: {(msg.recipients ?? []).join(", ")} | 
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Compose Dialog */}
      <Dialog open={isComposeOpen} onClose={() => setIsComposeOpen(false)}>
        <DialogTitle>Compose New Message</DialogTitle>
        <DialogContent>
          <TextField
            label="Recipient (username)"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={draft.recipient}
            onChange={(e) => setDraft({ ...draft, recipient: e.target.value })}
          />
          <TextField
            label="Subject"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsComposeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
