// functions/signup.js
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  const { username, password } = JSON.parse(event.body);

  // MongoDB Atlas connection URI
  const mongoURI = "mongodb+srv://codenihar:codenihar3@undefined.4u8nfhd.mongodb.net/";
  const dbName = 'codenihar'; // Specify the database name
  const collectionName = 'users'; // Specify the collection name

  let client;

  try {
    client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if the username already exists
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Username already exists' }),
      };
    } else {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the collection
      const result = await collection.insertOne({
        username,
        password: hashedPassword,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Signup successful' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  } finally {
    if (client) {
      client.close();
    }
  }
};
