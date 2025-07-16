import React, { useState, useEffect } from "react";
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
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TuneIcon from "@mui/icons-material/Tune";
import * as XLSX from "xlsx";
import axios from "axios";

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    outletName: "",
    phone: "",
    code: "",
    prizeName: "",
    startDate: "",
    endDate: "",
  });

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5051/api/customer-records");
      const transformed = res.data.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        outletName: r.outletName,
        code: r.code.code,
        prizeName: r.code.prizeName,
        createdAt: new Date(r.createdAt).toLocaleString(),
      }));
      setRecords(transformed);
      setFilteredRecords(transformed);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const fetchFilteredData = () => {
    const filtered = records.filter((record) => {
      const matchesOutlet = record.outletName
        .toLowerCase()
        .includes(filters.outletName.toLowerCase());
      const matchesPhone = record.phone
        .toLowerCase()
        .includes(filters.phone.toLowerCase());
      const matchesCode = record.code
        .toLowerCase()
        .includes(filters.code.toLowerCase());
      const matchesPrizeName = record.prizeName
        .toLowerCase()
        .includes(filters.prizeName.toLowerCase());

      const createdAt = new Date(record.createdAt);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      const matchesStartDate = !start || createdAt >= start;
      const matchesEndDate = !end || createdAt <= end;

      return (
        matchesOutlet &&
        matchesPhone &&
        matchesCode &&
        matchesPrizeName &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    setFilteredRecords(filtered);
  };

  const handleExcelExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
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
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Customer Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "outletName", headerName: "Outlet", flex: 1 },
    { field: "code", headerName: "Prize Code", flex: 1 },
    { field: "prizeName", headerName: "Prize Name", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  const displayedRecords = filteredRecords.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
              {["outletName", "phone", "code"].map((field, i) => (
                <Grid item xs={12} md={2.4} key={field}>
                  <TextField
                    size="small"
                    label={
                      field === "code"
                        ? "Prize Code"
                        : field === "phone"
                        ? "Phone Number"
                        : "Outlet Name"
                    }
                    variant="outlined"
                    fullWidth
                    value={filters[field]}
                    onChange={handleChange(field)}
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
              ))}

              <Grid item xs={12} md={2.4}>
                <TextField
                  size="small"
                  label="Prize Name"
                  variant="outlined"
                  fullWidth
                  value={filters.prizeName}
                  onChange={handleChange("prizeName")}
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

          <Box display="flex" justifyContent="flex-end" mb={1}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 250,
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
          </Box>

          <Box sx={{ height: "40vh", width: "100%" }}>
            <DataGrid
              rows={displayedRecords}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              loading={loading}
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
