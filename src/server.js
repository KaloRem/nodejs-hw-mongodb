const express = require('express');
const cors = require('cors');
const pino = require('pino-http');
const dotenv = require('dotenv');
const { getAllContacts, getContactById } = require('./services/contacts');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(pino());

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Error fetching contacts',
    });
  }
});

app.get('/contacts/:contactId', async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Error fetching contact',
    });
  }
});

const setupServer = () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

module.exports = { setupServer };
