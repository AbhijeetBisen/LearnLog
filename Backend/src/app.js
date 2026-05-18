const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");

const authMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");

connectDB();

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "../views"));

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/journal", authMiddleware, journalRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/profile", profileRoutes);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.use(express.static("public"));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.use(errorMiddleware);

module.exports = app;
