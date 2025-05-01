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
          alt="Mega Logo"
          sx={{
            width: { xs: "45%", sm: "140px", md: "10%", lg: "11%" },
            mt: 2,
            mb: 3,
          }}
        />

        {/* Card */}
        <Paper
          elevation={1}
          sx={{
            width: { xs: "100%", sm: "90%", md: "500px", lg: "600px" },
            pt: { md: 2, lg: 2 },
            pr: { md: 9, lg: 9 },
            pl: { md: 9, lg: 9 },
            pb: 3,
            borderRadius: 4,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            component="form"
            maxWidth={{ xs: "100%", sm: "90%", md: "100%", lg: "100%" }}
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            // alignItems={"center"}
            padding={4}
            // maxWidth={"50%"}
            gap={2}
          >
            <Typography
              // variant="h5"
              // textAlign="center"
              // fontWeight="bold"
              fontSize={"1.1rem"}
              color="black"
              // mb={1}
            >
              အမည်
            </Typography>
            <TextField
              // fontSize={"1.1rem"}
              label="မိမိ၏အမည်ထည့်ပါ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
            />
            <Typography
              fontSize={"1.1rem"}
              // variant="h5"
              // textAlign="center"
              // fontWeight="bold"
              // color="#1F4F9E"
              // mb={1}
            >
              ဖုန်းနံပါတ်
            </Typography>
            <TextField
              label="မိမိ၏ဖုန်းနံပါတ်ထည့်ပါ"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              fullWidth
              disabled={isLoading}
              error={Boolean(phoneError)}
              helperText={phoneError}
              variant="outlined"
            />
            <Typography
              fontSize={"1.1rem"}
              // variant="h5"
              // textAlign="center"
              // fontWeight="bold"
              // color="#1F4F9E"
              // mb={1}
            >
              လျို့ဝှက်ကုဒ်
            </Typography>
            <TextField
              label="မိမိ၏လျို့ဝှက်ကုဒ်ထည့်ပါ"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
            />

            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </Paper>
        <Button
          type="submit"
          variant="contained"
          onSubmit={handleSubmit}
          onClick={handleSubmit}
          // fullWidth
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
            "Submit"
          )}
        </Button>
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
      <Box position="relative" zIndex={2} borderRadius={"30%"}>
        <Dialog open={showDialog} onClose={handleDialogClose}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            <Box
              component="img"
              src="tick.png"
              alt="Mega Logo"
              sx={{
                width: { xs: "30%", sm: "140px", md: "20%", lg: "20%" },
                // mt: 8,
                // mb: 3,
              }}
            />
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} alignItems="center">
              {/* {icon} */}
              <Typography textAlign="center">ဂုဏ်ယူပါတယ်</Typography>
              <Typography textAlign="center">
                လူကြီးမင်းဖြည့်စွက်ထားသောကုဒ်မှ
              </Typography>
              <Typography textAlign="center">
                {result} ဒစ်စကောင့်ရရှိပါတယ်
              </Typography>
              {/* <Typography variant="h6">You won: {result} 🎁</Typography> */}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button variant="contained" onClick={handleDialogClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box
        width={"100%"}
        height={"10vh"}
        sx={{ backgroundColor: "#DFF5FE" }}
      ></Box>
    </>
  );
};

export default CodeChecker;
