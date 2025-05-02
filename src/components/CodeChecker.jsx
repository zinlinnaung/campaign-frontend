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
import { useRecordContext } from "../context/RecordContext";

// 🎁 Prize codes
const codeMap = {
  // Enat codes
  enat01: "Enat",
  enat02: "Enat",
  enat03: "Enat",
  enat04: "Enat",
  enat05: "Enat",
  enat06: "Enat",
  enat07: "Enat",
  enat08: "Enat",
  enat09: "Enat",
  enat10: "Enat",
  enat11: "Enat",
  enat12: "Enat",
  enat13: "Enat",
  enat14: "Enat",
  enat15: "Enat",
  enat16: "Enat",
  enat17: "Enat",
  enat18: "Enat",
  enat19: "Enat",
  enat20: "Enat",
  // Ferrovit codes
  ferro01: "Ferrovit",
  ferro02: "Ferrovit",
  ferro03: "Ferrovit",
  ferro04: "Ferrovit",
  ferro05: "Ferrovit",
  ferro06: "Ferrovit",
  ferro07: "Ferrovit",
  ferro08: "Ferrovit",
  ferro09: "Ferrovit",
  ferro10: "Ferrovit",
  ferro11: "Ferrovit",
  ferro12: "Ferrovit",
  ferro13: "Ferrovit",
  ferro14: "Ferrovit",
  ferro15: "Ferrovit",
  ferro16: "Ferrovit",
  ferro17: "Ferrovit",
  ferro18: "Ferrovit",
  ferro19: "Ferrovit",
  ferro20: "Ferrovit",
};

const CodeChecker = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [usedCodes, setUsedCodes] = useState(new Set());
  const [width, height] = useWindowSize();
  const { addRecord } = useRecordContext(); // Access context

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setPhoneError("");
    setResult("");

    const phoneRegex = /^09\d{7,9}$/;
    if (!phoneRegex.test(phone)) {
      setIsLoading(false);
      setPhoneError("Phone number must start with 09 and be 9–11 digits.");
      return;
    }

    setTimeout(() => {
      const trimmedCode = code.trim().toLowerCase();

      if (!codeMap.hasOwnProperty(trimmedCode)) {
        setError("Invalid code. Please try again.");
      } else {
        // ✅ Check if this code is already used in localStorage via context
        const savedRecords = JSON.parse(
          localStorage.getItem("records") || "[]"
        );
        const isCodeUsed = savedRecords.some(
          (record) => record.code === trimmedCode
        );

        if (isCodeUsed) {
          setError("လူကြီးမင်း ၏ ကုဒ် သည် အသုံးပြုပြီးသား ဖြစ်နေပါသည်");
        } else {
          const prize = codeMap[trimmedCode];
          addRecord({
            name,
            phone,
            code: trimmedCode,
            prize,
          });

          setResult(prize);
          setShowDialog(true);
        }
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
      case "Enat":
        return {
          color: "#0f5132",
          icon: <StarsIcon fontSize="large" color="success" />,
        };
      case "Ferrovit":
        return {
          color: "#664d03",
          icon: <FlashOnIcon fontSize="large" color="warning" />,
        };
      default:
        return {};
    }
  };

  const { icon } = getPrizeStyle();

  return (
    <>
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
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            padding={4}
            gap={2}
          >
            <Typography fontSize={"1.1rem"} color="black">
              အမည်
            </Typography>
            <TextField
              label="ကာစတန်မာ၏ အမည်ဖြည့်သွင်းပါ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
            />
            <Typography fontSize={"1.1rem"}>ဖုန်းနံပါတ်</Typography>
            <TextField
              label="ကာစတန်မာ၏ ဖုန်းနံပါတ်ဖြည့်သွင်းပါ"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              fullWidth
              disabled={isLoading}
              error={Boolean(phoneError)}
              helperText={phoneError}
              variant="outlined"
            />
            <Typography fontSize={"1.1rem"}>လျို့ဝှက်ကုဒ်</Typography>
            <TextField
              label="ကာစတန်မာ ၏ လျှို့၀ှက်ကုဒ်ကို ဖြည့်သွင်းပါ"
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
          onClick={handleSubmit}
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

      <Box position="relative" zIndex={2}>
        <Dialog open={showDialog} onClose={handleDialogClose}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            <Box
              component="img"
              src="tick.png"
              alt="Tick"
              sx={{
                width: { xs: "30%", sm: "140px", md: "20%", lg: "20%" },
              }}
            />
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} alignItems="center">
              {icon}
              <Typography textAlign="center">ဂုဏ်ယူပါတယ်</Typography>
              <Typography textAlign="center">
                လူကြီးမင်းဖြည့်စွက်ထားသောကုဒ်မှ
              </Typography>
              <Typography textAlign="center">
                {result} ဒစ်စကောင့်ရရှိပါတယ်
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

      <Box
        width={"100%"}
        height={"10vh"}
        sx={{ backgroundColor: "#DFF5FE" }}
      ></Box>
    </>
  );
};

export default CodeChecker;
