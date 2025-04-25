import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";

const AccountSettings = () => {
  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Account Settings
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your personal information and change your password.
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              defaultValue="Admin User"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email Address"
              fullWidth
              variant="outlined"
              defaultValue="admin@example.com"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button variant="contained" size="large">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AccountSettings;
