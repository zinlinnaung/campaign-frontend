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
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { useNavigate } from "react-router-dom"; // 👈 Required for routing

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [width, height] = useWindowSize();
  const navigate = useNavigate(); // 👈 Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowDialog(false);

    const phoneRegex = /^09\d{6,9}$/;

    setTimeout(() => {
      if (!phoneRegex.test(phone)) {
        setError("ဖုန်းနံပါတ်သည် 09 ဖြင့်စတင်ရပါမည်။");
      } else if (phone === "095192868" && password === "admin123") {
        navigate("/dashboard"); // 👈 Redirect on success
      } else {
        setError("ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မှားနေပါသည်။");
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "90vh",
          backgroundColor: "#ffffff",
          // backgroundImage: "url('text.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
        }}
      >
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
            <Typography mb={1}>ဖုန်းနံပါတ်</Typography>
            <TextField
              label="ဖုန်းနံပါတ်ထည့်ပါ"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              fullWidth
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: <PhoneAndroidIcon fontSize="small" />,
              }}
            />

            <Typography mb={1}>စကားဝှက်</Typography>
            <TextField
              label="စကားဝှက်ထည့်ပါ"
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
    </>
  );
};

export default LoginPage;
