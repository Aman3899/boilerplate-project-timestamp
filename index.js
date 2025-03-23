const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to serve static files
app.use(express.static("public"));

// Enable CORS (for testing from different origins)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Root route for frontend
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// API endpoint for timestamp
app.get("/api/:date?", (req, res) => {
    const { date } = req.params;

    // If no date is provided, use current time
    if (!date) {
        const now = new Date();
        return res.json({
            unix: now.getTime(),
            utc: now.toUTCString()
        });
    }

    // Parse the date input
    let parsedDate;
    // Check if the input is a Unix timestamp (numeric)
    if (!isNaN(date) && !isNaN(parseInt(date))) {
        parsedDate = new Date(parseInt(date));
    } else {
        // Try parsing as a date string
        parsedDate = new Date(date);
    }

    // Validate the parsed date
    if (isNaN(parsedDate.getTime())) {
        return res.json({ error: "Invalid Date" });
    }

    // Return the response in required format
    res.json({
        unix: parsedDate.getTime(),
        utc: parsedDate.toUTCString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});