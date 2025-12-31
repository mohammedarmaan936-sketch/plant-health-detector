const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// ✅ Serve frontend files
app.use(express.static(__dirname));

const upload = multer({ dest: "uploads/" });
const API_KEY = process.env.PLANTNET_API_KEY;

app.post("/analyze", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const buffer = fs.readFileSync(req.file.path);
        const blob = new Blob([buffer]);

        const formData = new FormData();
        formData.append("images", blob, req.file.originalname);

        const response = await fetch(
            `https://my-api.plantnet.org/v2/diseases/identify?lang=en&nb-results=3&no-reject=true&api-key=${API_KEY}`,
            { method: "POST", body: formData }
        );

        const data = await response.json();
        fs.unlinkSync(req.file.path);

        res.json(data);
    } catch (err) {
        console.error("BACKEND ERROR:", err);
        res.status(500).json({ error: "Failed to analyze image" });
    }
});

// ✅ Root route serves index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
