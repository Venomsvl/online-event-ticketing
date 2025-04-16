const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://DbUser:Born260805@project.dod28.mongodb.net/?retryWrites=true&w=majority&appName=project";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
<<<<<<< HEAD
=======
    strict: true,
    deprecationErrors: true,
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  } finally {
    await client.close();
  }
}
<<<<<<< HEAD
run();
=======
run();
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
