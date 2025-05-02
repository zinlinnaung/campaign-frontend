import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Container,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import * as XLSX from "xlsx";
import { useRecordContext } from "../../context/RecordContext";

const AdminDashboard = () => {
  const [form, setForm] = useState({
    outletName: "",
    phone: "",
    code: "",
    name: "",
  });

  const [error, setError] = useState("");

  const { records, addRecord } = useRecordContext();

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = () => {
    if (!form.outletName || !form.phone || !form.code || !form.name) {
      setError("Please fill all fields.");
      return;
    }

    const newRecord = {
      id: Date.now(), // ✅ Ensure unique ID
      name: form.name,
      phone: form.phone,
      outletName: form.outletName,
      code: form.code,
      createdAt: new Date().toLocaleString(),
    };

    addRecord(newRecord);
    setForm({ outletName: "", phone: "", code: "", name: "" });
    setError("");
  };

  const handleExcelExport = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submitted Records");
    XLSX.writeFile(wb, "submitted_records.xlsx");
  };

  const gradientButtonStyle = {
    background: "linear-gradient(to right, #5db6be, #34609e)",
    color: "#fff",
    textTransform: "none",
    borderRadius: 2,
    px: 2,
    "&:hover": {
      background: "linear-gradient(to right, #3cbfa7, #15124d)",
    },
  };

  const textFieldStyle = {
    backgroundColor: "#ffffff",
    borderRadius: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Customer Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "outletName", headerName: "Outlet", flex: 1 },
    { field: "code", headerName: "Prize Code", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  return (
    <Box sx={{ bgcolor: "#f5fafe", py: 3, minHeight: "84vh" }}>
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            border: "1px solid #e0f0f8",
          }}
        >
          <CardHeader
            avatar={
              <Tooltip title="Add Record">
                <AddCircleOutlineIcon fontSize="small" color="primary" />
              </Tooltip>
            }
            titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
            title="Submit Prize Record"
            subheader="Fill out the details below to add a new record"
            subheaderTypographyProps={{ fontSize: "0.85rem" }}
          />
          <Divider />
          <CardContent sx={{ pt: 2, pb: 1 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Customer Name"
                  variant="outlined"
                  fullWidth
                  value={form.name}
                  onChange={handleChange("name")}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={form.phone}
                  onChange={handleChange("phone")}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Outlet Name"
                  variant="outlined"
                  fullWidth
                  value={form.outletName}
                  onChange={handleChange("outletName")}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Prize Code"
                  variant="outlined"
                  fullWidth
                  value={form.code}
                  onChange={handleChange("code")}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                sx={{ ...gradientButtonStyle, mr: 1 }}
              >
                Submit Record
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleExcelExport}
                sx={gradientButtonStyle}
              >
                Export to Excel
              </Button>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Typography color="error" fontSize="0.9rem" mb={2}>
            {error}
          </Typography>
        )}

        <Paper elevation={2} sx={{ borderRadius: 2, p: 2, height: "100%" }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            fontSize="1rem"
            color="#0072ff"
          >
            Submitted Records
          </Typography>
          <Box sx={{ height: "40vh", width: "100%" }}>
            <DataGrid
              rows={records}
              columns={columns}
              getRowId={(row) => row.id} // ✅ FIX: Ensure unique ID
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{
                fontSize: "0.85rem",
                backgroundColor: "#ffffff",
                borderRadius: 2,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#e6f7ff",
                  color: "#0072ff",
                  fontWeight: 600,
                },
                "& .MuiDataGrid-cell": {
                  py: 1,
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
