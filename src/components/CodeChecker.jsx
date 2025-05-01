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
} from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const CodeChecker = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [width, height] = useWindowSize();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult("");
    setPhoneError("");
    setShowDialog(false);

    const phoneRegex = /^09\d{7,9}$/;
    if (!phoneRegex.test(phone)) {
      setIsLoading(false);
      setPhoneError("Phone number must start with 09 and be 9–11 digits.");
      return;
    }

    setTimeout(() => {
      if (code.toLowerCase() === "1234") {
        setResult("E-net");
        setShowDialog(true);
      } else if (code.toLowerCase() === "5678") {
        setResult("Falobit");
        setShowDialog(true);
      } else {
        setError("Invalid code. Please try again.");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setName("");
    setPhone("");
    setCode("");
  };

  const getPrizeStyle = () => {
    switch (result) {
      case "E-net":
        return {
          color: "#0f5132",
          icon: <StarsIcon fontSize="large" color="success" />,
        };
      case "Falobit":
        return {
          color: "#664d03",
          icon: <FlashOnIcon fontSize="large" color="warning" />,
        };
      default:
        return {};
    }
  };

  const { icon, color } = getPrizeStyle();

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 10,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Mega We Care
        </Typography>

        <TextField
          label="Your Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={isLoading}
        />

        <TextField
          label="Phone Number"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          fullWidth
          disabled={isLoading}
          error={Boolean(phoneError)}
          helperText={phoneError}
        />

        <TextField
          label="Enter Code"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Check Prize"
          )}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      {/* Confetti behind the dialog */}
      {showDialog && (
        <Box
          position="absolute"
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
            recycle={false}
            numberOfPieces={150}
          />
        </Box>
      )}

      {/* Dialog with prize info */}
      <Box position="relative" zIndex={2}>
        <Dialog open={showDialog} onClose={handleDialogClose}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            🎉 Congratulations!
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} alignItems="center" color={color}>
              {icon}
              <Typography variant="h6">You won: {result} 🎁</Typography>
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

export default CodeChecker;
