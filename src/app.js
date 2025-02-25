require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const downloadCSVRoutes=require('./routes/downloadCSVRoutes')
const connectDB = require('./confiq/database'); 
const swaggerUi = require('swagger-ui-express');
const app = express();
const yaml = require("yamljs");


// Connect to Database
connectDB();

// Enable CORS Middleware
app.use(cors());

// Parse JSON Request Bodies
app.use(express.json());

// Add Routes
app.use(uploadRoutes);
app.use(statusRoutes);
app.use(downloadCSVRoutes);
const swaggerDocument = yaml.load('./src/docs/swagger.yaml');
// Serve the Swagger documentation
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//redirect to swagger
// Routes
app.get("/", (req, res) => {
    res.redirect("/api/v1/api-docs");
  });
  


module.exports = app;
