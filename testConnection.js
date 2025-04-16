const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://DbUser:Born260805@project.dod28.mongodb.net/?retryWrites=true&w=majority&appName=project";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
strict: true,
deprecationErrors: true,
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
run();
