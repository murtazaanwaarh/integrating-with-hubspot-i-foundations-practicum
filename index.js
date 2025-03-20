require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const HUBSPOT_API_URL = "https://api.hubapi.com/crm/v3/objects";
const GET_HUBSPOT_API_URL = "https://api.hubapi.com/crm/v3/objects";
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// Axios Configuration
const axiosInstance = axios.create({
  baseURL: HUBSPOT_API_URL,
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});


const axiosInstance_get = axios.create({
  baseURL: GET_HUBSPOT_API_URL,
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

app.get("/", async (req, res) => {
  console.log("function entered")
  try {
    const response = await axiosInstance_get.get(`/${CUSTOM_OBJECT_TYPE}?properties=name,specie,owner_s_name,color`);
    const pets = response.data;
    console.log(pets);
    console.log("HubSpot API Response:", JSON.stringify(response.data, null, 2));  // ✅ Log API response

    res.render("homepage", { pets: response.data.results, title: "Pets Records" });
  } catch (error) {
    console.error("Error fetching records:", error.response?.data || error.message);
    res.status(500).send("Error fetching data");
  }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// 2️⃣ GET "/update-cobj" - Render Form to Add New Pet
app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Add New Pet" });
});

// 3️⃣ POST "/update-cobj" - Submit Form Data to HubSpot
app.post("/update-cobj", async (req, res) => {
  const { name, specie, owner_s_name, color } = req.body;

  try {
    await axiosInstance.post(`/${CUSTOM_OBJECT_TYPE}`, {
      properties: { name, specie, owner_s_name, color },
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error creating record:", error.response?.data || error.message);
    res.status(500).send("Error creating record");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});