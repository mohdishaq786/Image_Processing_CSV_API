## Install Dependencies

After cloning the repository, navigate to the root directory and run:

`npm install`

### Run server & worker with live reload 
  Runs both server.js and imageWorker.js in parallel, with auto-reload.
  
 `npm run dev`

### OR Setup everything in one command
  `npm run setup`

##Swagger Docs

![Alt Text](/src/Img/Swagger.png)


# Backend API Documentation

### Overview
This API provides functionalities to upload CSV files, check the processing status, and download processed data in CSV format.

### Server

- **Base URL:** `- url: https://image-processing-csv-api.onrender.com
    description: Production server
  - url: http://localhost:5000
    description: Development server`

### Endpoints:

### 1. Upload CSV File

**Endpoint:** `POST /upload`

**Description:**
Upload a CSV file containing product names and image URLs. The server validates the CSV format, processes the entries, and returns a unique request ID.

**Request:**
- **Form Data:** `file` (CSV file)

**Response:**
- **Status:** `201 Created`
```json
{
  "message": "File uploaded successfully",
  "requestId": "<unique-request-id>"
}
```

### 2. Check Processing Status

**Endpoint:** `GET /status/{requestId}`

**Description:**
Check the processing status of the images uploaded via CSV. Use the unique request ID provided after uploading.

**Response:**
```json
[
  {
    "requestId": "unique-request-id",
    "status": "Completed",
    "outputImages": ["url1.jpg", "url2.jpg"]
  },
  ...
]
```

### 3. Download Processed Data (CSV)

**Endpoint:** `GET /download/{requestId}`

**Description:**
Download the processed image URLs as a CSV file. Provide the unique request ID to retrieve your data.

**Response:**
- CSV file download with the following columns:
  - **S. No.**
  - **Product Name**
  - **Input Image Urls**
  - **Output Image Urls**

**HTTP Status Codes:**
- `200`: CSV file downloaded successfully.
- `404`: Request not found (invalid or incorrect request ID).

### Error Handling:

| Status Code | Description              |
|-------------|--------------------------|
| 400         | Invalid request data     |
| 404         | Request ID not found     |
| 500         | Internal server error    |

