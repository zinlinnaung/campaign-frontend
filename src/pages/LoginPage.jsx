import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [width, height] = useWindowSize();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowDialog(false);

    setTimeout(() => {
      // Simulating login logic
      if (email === "user@example.com" && password === "password123") {
        setShowDialog(true);
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {/* Page Background */}
      <Box
        sx={{
          minHeight: "90vh",
          backgroundColor: "#ffffff",
          backgroundImage: "url('text.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="logo.png"
          alt="Logo"
          sx={{
            width: { xs: "45%", sm: "140px", md: "10%", lg: "12%" },
            mt: 2,
            mb: 3,
          }}
        />

        {/* Card */}
        <Paper
          elevation={3}
          sx={{
            width: { xs: "100%", sm: "90%", md: "500px", lg: "700px" },
            pt: { md: 2, lg: 2 },
            pr: { md: 9, lg: 9 },
            pl: { md: 9, lg: 9 },
            pb: 6,
            borderRadius: 4,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            padding={4}
            gap={2}
          >
            <Typography mb={1}>Email</Typography>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: <EmailIcon fontSize="small" />,
              }}
            />

            <Typography mb={1}>Password</Typography>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: <LockIcon fontSize="small" />,
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(to right, #00B5FF, #1F4F9E)",
                color: "#fff",
                py: 1.5,
                mt: 3,
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "bold",
                minWidth: "150px",
                "&:hover": {
                  background: "linear-gradient(to right, #1F4F9E, #00B5FF)",
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Confetti */}
      {showDialog && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          zIndex={1}
          pointerEvents="none"
        >
          <Confetti
            width={width}
            height={height}
            numberOfPieces={200}
            recycle={false}
          />
        </Box>
      )}

      {/* Dialog */}
      <Box position="relative" zIndex={2}>
        <Dialog open={showDialog} onClose={handleDialogClose}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            <Box
              component="img"
              src="tick.png"
              alt="Success"
              sx={{
                width: { xs: "45%", sm: "140px", md: "20%", lg: "20%" },
              }}
            />
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} alignItems="center">
              <Typography textAlign="center">Congratulations!</Typography>
              <Typography textAlign="center">
                You have successfully logged in.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button variant="contained" onClick={handleDialogClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default LoginPage;
