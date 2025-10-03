import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      const { access_token, refresh_token } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          width: "100%",
          maxWidth: 420, // chiều rộng cố định, căn giữa
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 64,
            height: 64,
            margin: "0 auto",
            mb: 2,
          }}
        >
          <LockOutlinedIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.3,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );

}

export default Login;

