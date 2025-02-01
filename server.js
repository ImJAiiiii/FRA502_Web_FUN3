const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const FILE_PATH = "counter_logs.json";

// Load initial data
const loadData = () => {
    try {
        return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    } catch (error) {
        return [];
    }
};

// Save data
const saveData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Route to get saved logs
app.get("/logs", (req, res) => {
    res.json(loadData());
});

// Route to save current count with timestamp
app.post("/save", (req, res) => {
    const { count } = req.body;
    if (typeof count === "number") {
        const logs = loadData();
        const timestamp = new Date().toString();
        logs.push({ timestamp, count });
        saveData(logs);
        res.json({ message: "Saved successfully", logs });
    } else {
        res.status(400).json({ error: "Invalid count value" });
    }
});

// Route to reset logs
app.post("/reset", (req, res) => {
    saveData([]);
    res.json({ message: "Logs reset successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
