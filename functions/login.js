// functions/login.js
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

    const user = await collection.findOne({ username });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Login successful' }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Login failed: Incorrect password' }),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Login failed: User not found' }),
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
