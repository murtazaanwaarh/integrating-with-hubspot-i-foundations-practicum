const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const pug = require('pug');
dotenv.config();
console.log("testing")
console.log(process.env.HUBSPOT_API_KEY);  // Should print the API key

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://api.hubapi.com/crm/v3/objects/pets', {
        headers: { Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}` }
      });
      res.render('homepage', { records: response.data.results });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving records');
    }
  });
  

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form' });
  });
  

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form' });
  });
  
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, bio } = req.body;
    const response = await axios.post('https://api.hubapi.com/crm/v3/objects/pets', {
      properties: { Name: name, Bio: bio }
    }, {
      headers: { Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}` }
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating record');
  }
});
  


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));