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
import axios from "axios";

const CodeChecker = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [outletName, setOutletName] = useState(""); // New
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [width, height] = useWindowSize();
  const [township, setTownship] = useState("");

  const handleSubmit = async (e) => {
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

    try {
      const res = await axios.post(
        "https://megawecare.tharapa.ai/api/customer-records",
        {
          name,
          phone,
          code,
          outletName,
          township,
        }
      );

      const prizeName = res.data?.prizeName || "Prize";
      setResult(prizeName);
      setShowDialog(true);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        const msg = err.response.data?.message;

        if (msg === "Code has already been used") {
          setError("လူကြီးမင်း ၏ ကုဒ် သည် အသုံးပြုပြီးသား ဖြစ်နေပါသည်။");
        } else if (msg === "Phone number already exists") {
          setError("ဖုန်းနံပါတ်သည် စနစ်တွင် ရှိပြီးဖြစ်ပါသည်။");
        } else {
          setError("တောင်းဆိုမှုတွင် ပြဿနာတစ်ခုရှိနေပါသည်။");
        }
      } else if (err.response && err.response.status === 404) {
        setError("လူကြီးမင်း ထည့်သွင်းသော ကုဒ်သည် မမှန်ကန်ပါ။");
      } else {
        setError(
          "စနစ်အမှားရှိနေပါသည်။ ကျေးဇူးပြု၍ နောက်တစ်ကြိမ် ပြန်စမ်းကြည့်ပါ။"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setName("");
    setPhone("");
    setCode("");
    setOutletName("");
    setTownship("");
  };

  const getPrizeStyle = () => {
    switch (result.toLowerCase()) {
      case "enat":
        return {
          color: "#0f5132",
          icon: <StarsIcon fontSize="large" color="success" />,
        };
      case "ferrovit":
        return {
          color: "#664d03",
          icon: <FlashOnIcon fontSize="large" color="warning" />,
        };
      default:
        return {
          color: "#1f2937",
          icon: <StarsIcon fontSize="large" />,
        };
    }
  };

  const { icon } = getPrizeStyle();

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
          src="wecare.png"
          alt="Mega Logo"
          sx={{
            width: { xs: "30%", sm: "140px", md: "8%", lg: "8%" },
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

            <Typography fontSize={"1.1rem"}>
              ဖုန်းနံပါတ် ( viber နံပါတ် )
            </Typography>
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

            <Typography fontSize={"1.1rem"}>ဆိုင်အမည်</Typography>
            <TextField
              label="ဆိုင်အမည် ဖြည့်သွင်းပါ"
              value={outletName}
              onChange={(e) => setOutletName(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
            />

            <Typography fontSize={"1.1rem"}>မြို့နယ်</Typography>
            <TextField
              label="မြို့နယ် ဖြည့်သွင်းပါ"
              value={township}
              onChange={(e) => setTownship(e.target.value)}
              fullWidth
              disabled={isLoading}
              variant="outlined"
            />

            <Typography fontSize={"1.1rem"}>လျို့ဝှက်ကုဒ်</Typography>
            <TextField
              label="လျှို့ဝှက်ကုဒ် ဖြည့်သွင်းပါ"
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
