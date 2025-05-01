import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Slider,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import QRCodeStyling from "qr-code-styling";
import * as XLSX from "xlsx";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(240);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [logoFile, setLogoFile] = useState(null);
  const [logoSize, setLogoSize] = useState(30);
  const [fileFormat, setFileFormat] = useState("png");
  const [dotStyle, setDotStyle] = useState("rounded");
  const [cornerRadius, setCornerRadius] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [links, setLinks] = useState([]);
  const qrRef = useRef(null);
  const qrCode = useRef(null);

  // Initialize QR code
  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: size,
        height: size,
        type: "canvas",
        data: text || "Hello World",
        image: logoFile || undefined,
        dotsOptions: {
          color: fgColor,
          type: dotStyle,
          radius: dotStyle === "dot" ? 0.4 : undefined, // Increase for dot-style circles
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10,
          imageSize: logoSize / 100,
        },
        cornersSquareOptions: {
          type: cornerRadius === 0 ? "square" : "rounded",
          size: cornerRadius / 100,
        },
      });

      if (qrRef.current) {
        qrCode.current.append(qrRef.current);
      }
    } else {
      // Update the QR code whenever any dependency changes
      const logoData = logoFile ? { image: logoFile } : {};
      const logoOptions = {
        ...logoData,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10,
          imageSize: logoSize / 100,
        },
      };

      qrCode.current.update({
        width: size,
        height: size,
        data: text || "Hello World",
        dotsOptions: {
          color: fgColor,
          type: dotStyle,
          radius: dotStyle === "dot" ? 0.4 : undefined, // Adjust for circle effect
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          type: cornerRadius === 0 ? "square" : "rounded",
          size: cornerRadius / 100,
        },
        ...logoOptions, // Ensure the logo options are correctly passed
      });
    }
  }, [
    text,
    size,
    bgColor,
    fgColor,
    logoFile,
    logoSize,
    dotStyle,
    cornerRadius,
  ]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setLogoFile(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null); // Remove the logo by setting it to null
    qrCode.current.update({
      image: null, // Remove logo from the QR code when the logo is removed
    });
  };

  const handleDownload = async () => {
    if (!qrCode.current) return;

    // Generate QR code as blob
    const blob = await qrCode.current.getRawData(fileFormat);

    const qrImage = new Image();
    const reader = new FileReader();

    reader.onload = function (event) {
      qrImage.src = event.target.result;

      qrImage.onload = function () {
        const borderSize = 40;

        const canvas = document.createElement("canvas");
        canvas.width = qrImage.width + borderSize * 2;
        canvas.height = qrImage.height + borderSize * 2;

        const ctx = canvas.getContext("2d");

        // Fill background white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR in center
        ctx.drawImage(qrImage, borderSize, borderSize);

        // Add copyright text
        const copyrightText = "© tharapa.ai";
        ctx.font = "16px Arial";
        ctx.fillStyle = "#808080"; // Gray text
        const textWidth = ctx.measureText(copyrightText).width;
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height - 10; // 10px from bottom
        ctx.fillText(copyrightText, x, y);

        // Download the image
        const link = document.createElement("a");
        link.href = canvas.toDataURL(`image/${fileFormat}`);
        link.download = `qr-code.${fileFormat}`;
        link.click();
      };
    };

    reader.readAsDataURL(blob);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleGenerateZip = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const extractedLinks = XLSX.utils
        .sheet_to_json(sheet, { header: 1 })
        .map((row) => row[0])
        .filter((link) => !!link); // Filter out empty rows

      if (extractedLinks.length === 0) {
        alert("No valid links found in the file.");
        return;
      }

      setLinks(extractedLinks);

      const zip = new JSZip();

      for (const link of extractedLinks) {
        // Use the same settings as the main QR code generator
        const tempQr = new QRCodeStyling({
          width: size,
          height: size,
          type: "canvas",
          data: link,
          image: logoFile || undefined, // Include the logo if available
          dotsOptions: {
            color: fgColor,
            type: dotStyle,
            radius: dotStyle === "dot" ? 0.4 : undefined,
          },
          backgroundOptions: {
            color: bgColor,
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
            imageSize: logoSize / 100,
          },
          cornersSquareOptions: {
            type: cornerRadius === 0 ? "square" : "rounded",
            size: cornerRadius / 100,
          },
        });

        // Create a temporary hidden div and canvas
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        document.body.appendChild(tempDiv);

        await tempQr.append(tempDiv);

        // Wait shortly to ensure QR is rendered
        await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms

        const canvas = tempDiv.querySelector("canvas");
        const ctx = canvas.getContext("2d");

        // Set the font and draw the copyright text
        ctx.font = "16px Arial";
        ctx.fillStyle = "#808080"; // Black text color (you can change this if needed)
        const text = "© tharapa.ai"; // The copyright text
        const textWidth = ctx.measureText(text).width;

        // Position the text at the bottom-center of the QR code
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height - 10; // 10px from the bottom

        // Ensure the text doesn't overlap with QR code
        ctx.fillText(text, x, y);

        const blob = await tempQr.getRawData(fileFormat);

        const sanitizedFileName = link.replace(/[^a-zA-Z0-9-_]/g, "_"); // Clean filename

        zip.file(`${sanitizedFileName}.${fileFormat}`, blob);

        document.body.removeChild(tempDiv); // Clean up
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "qr-codes.zip");
      });
    };

    fileReader.readAsBinaryString(uploadedFile);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          QR Code Generator
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Grid container spacing={2} width="100%">
            {/* Left Side - QR Code Controls */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                mt: 4,
                width: {
                  xs: "100%", // Full width on xs screens
                  lg: "50%", // Half width on lg screens
                },
              }}
            >
              <TextField
                label="Enter text or URL"
                variant="outlined"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography gutterBottom>QR Size: {size}px</Typography>
              <Slider
                value={size}
                onChange={(e, val) => setSize(val)}
                min={200}
                max={500}
                step={10}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Foreground Color"
                type="color"
                fullWidth
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Background Color"
                type="color"
                fullWidth
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoUpload}
                />
              </Button>

              {logoFile && (
                <>
                  <Typography gutterBottom>Logo Size: {logoSize}%</Typography>
                  <Slider
                    value={logoSize}
                    onChange={(e, val) => setLogoSize(val)}
                    min={10}
                    max={43}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogoRemove}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Remove Logo
                  </Button>
                </>
              )}

              <Typography gutterBottom>
                Corner Radius: {cornerRadius}%
              </Typography>
              <Slider
                value={cornerRadius}
                onChange={(e, val) => setCornerRadius(val)}
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />

              {/* <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Dot Style</InputLabel>
                <Select
                  value={dotStyle}
                  label="Dot Style"
                  onChange={(e) => setDotStyle(e.target.value)}
                >
                  <MenuItem value="rounded">Rounded</MenuItem>
                  <MenuItem value="square">Square</MenuItem>
                  <MenuItem value="dot">Dot</MenuItem>
                </Select>
              </FormControl> */}

              <Box
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handleFileUpload({ target: { files: [file] } });
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                component="div"
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  padding: 4,
                  textAlign: "center",
                  mb: 2,
                  cursor: "pointer",
                }}
                onClick={() =>
                  document.getElementById("csv-upload-input").click()
                }
              >
                <Typography variant="body1">
                  {uploadedFile
                    ? uploadedFile.name
                    : "Drag & Drop CSV/XLSX or Click to Upload"}
                </Typography>
                <input
                  id="csv-upload-input"
                  type="file"
                  accept=".csv, .xlsx"
                  hidden
                  onChange={handleFileUpload}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGenerateZip}
                disabled={!uploadedFile}
              >
                Generate ZIP
              </Button>
            </Grid>

            {/* Right Side - QR Code Canvas */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: {
                  xs: "100%",
                  lg: "48%",
                },
              }}
            >
              <Box
                ref={qrRef}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  padding: 2,
                }}
              />
              <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    label="Format"
                  >
                    <MenuItem value="png">PNG</MenuItem>
                    <MenuItem value="jpeg">JPEG</MenuItem>
                    <MenuItem value="webp">WEBP</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleDownload}
                  sx={{ width: "50%" }}
                >
                  Download QR
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
