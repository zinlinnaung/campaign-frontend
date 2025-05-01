import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Container,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    outletName: "",
    phone: "",
    code: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const fetchFilteredData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (filters.outletName) params.append("outletName", filters.outletName);
      if (filters.phone) params.append("phone", filters.phone);
      if (filters.code) params.append("code", filters.code);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await fetch(
        `http://localhost:5051/api/customer-records?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch records: ${response.statusText}`);

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response, but received non-JSON");
      }

      const data = await response.json();

      const formatted = data.map((item) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        outletName: item.outletName,
        code: item.code.code,
        createdAt: new Date(item.createdAt).toLocaleString(),
      }));

      setRecords(formatted);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching records.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelExport = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Records");
    XLSX.writeFile(wb, "filtered_records.xlsx");
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
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Customer Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "outletName", headerName: "Outlet", flex: 1 },
    { field: "code", headerName: "Prize Code", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  useEffect(() => {
    fetchFilteredData();
  }, []);

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
              <Tooltip title="Filter Records">
                <TuneIcon fontSize="small" color="primary" />
              </Tooltip>
            }
            titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
            title="Filter Prize Records"
            subheader="Search by outlet, phone or prize code"
            subheaderTypographyProps={{ fontSize: "0.85rem" }}
          />
          <Divider />
          <CardContent sx={{ pt: 2, pb: 1 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={2.4}>
                <TextField
                  size="small"
                  label="Outlet Name"
                  variant="outlined"
                  fullWidth
                  value={filters.outletName}
                  onChange={handleChange("outletName")}
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  size="small"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={filters.phone}
                  onChange={handleChange("phone")}
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  size="small"
                  label="Prize Code"
                  variant="outlined"
                  fullWidth
                  value={filters.code}
                  onChange={handleChange("code")}
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  size="small"
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={filters.startDate}
                  onChange={handleChange("startDate")}
                  sx={textFieldStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  size="small"
                  label="End Date"
                  type="date"
                  fullWidth
                  value={filters.endDate}
                  onChange={handleChange("endDate")}
                  sx={textFieldStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="small"
                startIcon={<FilterAltIcon fontSize="small" />}
                onClick={fetchFilteredData}
                disabled={loading}
                sx={{ ...gradientButtonStyle, mr: 1 }}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Apply Filters"
                )}
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
            Filtered Records
          </Typography>
          <Box sx={{ height: "40vh", width: "100%" }}>
            <DataGrid
              rows={records}
              columns={columns}
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
