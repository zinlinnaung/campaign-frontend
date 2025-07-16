import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Tooltip,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";

const ExcelUploadPage = () => {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Add ref for file input to reset value
  const fileInputRef = useRef(null);

  const normalizeHeaders = (headers) =>
    headers.map((h) => (h ? h.toString().trim().toLowerCase() : ""));

  const clearUpload = () => {
    setExcelData([]);
    setFileName("");
    setError("");
    // Reset the file input value so same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Keep uploadResult to keep log visible until new upload
  };

  const parseExcel = (file) => {
    setLoading(true);
    setError("");
    setFileName(file.name);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (data.length === 0) {
          setError("Excel file is empty");
          setLoading(false);
          return;
        }

        let headers = data[0];
        headers = normalizeHeaders(headers);

        const rows = data.slice(1).map((row, index) => {
          const rowObj = { id: index + 1 };
          headers.forEach((header, i) => {
            rowObj[header] = row[i];
          });
          return rowObj;
        });

        setExcelData(rows);
      } catch (err) {
        setError("Invalid Excel file format.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const isExcelFile = (file) => {
    if (!file) return false;
    return file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (isExcelFile(file)) {
      parseExcel(file);
    } else {
      setError("Only Excel files (.xlsx, .xls) are supported.");
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (isExcelFile(file)) {
      parseExcel(file);
    } else {
      setError("Only Excel files (.xlsx, .xls) are supported.");
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (excelData.length === 0) {
      setError("No data to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setUploadResult(null);

    try {
      const response = await fetch(
        "https://megawecare.tharapa.ai/api/customer-records/upload-excel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ records: excelData }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      setUploadResult(result);

      setExcelData([]);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. " + err.message);
    } finally {
      setLoading(false);
    }
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
              <Tooltip title="Upload Excel">
                <UploadFileIcon fontSize="small" color="primary" />
              </Tooltip>
            }
            titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
            title="Upload Excel File"
            subheader="Drag & drop or browse to upload .xlsx or .xls file"
            subheaderTypographyProps={{ fontSize: "0.85rem" }}
          />
          <Divider />
          <CardContent>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                border: `2px dashed ${isDragging ? "#3cbfa7" : "#ccc"}`,
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                bgcolor: isDragging ? "#e6f7ff" : "#fafafa",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon fontSize="large" color="primary" />
              <Typography variant="subtitle1" mt={1}>
                Drag & Drop Excel file here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to browse
              </Typography>
              <input
                accept=".xlsx,.xls"
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="excel-upload"
                ref={fileInputRef}
              />
            </Box>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} md={6}>
                <Typography fontSize="0.9rem" color="textSecondary">
                  {fileName || "No file selected."}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {loading && <CircularProgress size={20} />}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {excelData.length > 0 && (
          <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              fontSize="1rem"
              color="#0072ff"
            >
              Parsed Excel Data
            </Typography>
            <Box sx={{ height: "60vh", width: "100%" }}>
              <DataGrid
                rows={excelData}
                columns={Object.keys(excelData[0]).map((key) => ({
                  field: key,
                  headerName: key,
                  flex: 1,
                }))}
                pageSize={10}
                rowsPerPageOptions={[10]}
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

            <Box mt={2} display="flex" justifyContent="flex-start" gap={2}>
              <Button
                variant="contained"
                sx={{ ...gradientButtonStyle }}
                onClick={handleSubmit}
                disabled={loading || excelData.length === 0}
              >
                Submit to Server
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearUpload}
                disabled={loading && excelData.length === 0}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        )}

        {uploadResult && (
          <Box mt={3}>
            <Alert severity="success" sx={{ mb: 1 }}>
              ✅ {uploadResult.createdCount} records created.
            </Alert>
            {uploadResult.failedRows.length > 0 && (
              <Alert severity="warning" sx={{ whiteSpace: "pre-wrap" }}>
                ❌ {uploadResult.failedRows.length} rows failed:
                <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                  {uploadResult.failedRows.map((fail, idx) => (
                    <li key={idx}>
                      Row {fail.row}: {fail.reason}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ExcelUploadPage;
