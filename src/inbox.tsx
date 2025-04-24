import { useState } from "react";
import { Box, Button, List, ListItem, ListItemText, Typography,TextField} from "@mui/material";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton,} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DeleteIcon from "@mui/icons-material/Delete";

function Inbox() {
  const [messages, setMessages] = useState([]);
  // State for the compose message 
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  // State for viewing message 
  const [selectedMessage, setSelectedMessage] = useState(null);
  // State for draft
  const [draft, setDraft] = useState({
    recipient: "",
    subject: "",
    body: "",
  });

  // Add a new message to the inbox
  const sendMessage = () => {
    const newMessage = {
      id: Date.now(),
      recipient: draft.recipient,
      subject: draft.subject,
      body: draft.body,
      read: false,
    };

    setMessages([newMessage, ...messages]);
    // if clicked out the message/dialog box message is saved  
    setDraft({ recipient: "", subject: "", body: "" });   
    setIsComposeOpen(false);
  };

  //  Delete a message [** Sometimes doesnt work look into it]
  const deleteMessage = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

    // Need to make marked message implementation
    // Need to be able to read message. When clicked on 

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Inbox
      </Typography>

      {/* Compose Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsComposeOpen(true)}
      >
        Compose
      </Button>

      {/* List of Received Messages */}
      <List sx={{ marginTop: 2 }}>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            sx={{
              backgroundColor: msg.read ? "lightgray" : "white",
              border: "1px solid #ccc",
              marginBottom: 1,
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => openMessage(msg)}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteMessage(msg.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <MailOutlineIcon
              sx={{
                marginRight: 1,
                color: msg.read ? "gray" : "blue",
              }}
            />
            <ListItemText
              primary={msg.subject}
              secondary={`To: ${msg.recipient}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Compose Message */}
      <Dialog open={isComposeOpen} onClose={() => setIsComposeOpen(false)}>
        <DialogTitle>Compose New Message</DialogTitle>
        <DialogContent>

           {/* Box for Recipient */}
          <TextField
            label="Recipient"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={draft.recipient}
            onChange={(e) =>
              setDraft({ ...draft, recipient: e.target.value })
            }
          />
          {/* Box For Subject */}
          <TextField
            label="Subject"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
          />
          {/* Box for Body */}
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
        </DialogContent>

        {/* Buttons to send or cancel */}
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

export default Inbox;
