import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  // Add any specific MongoDB connection options here
  // For example:
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};
console.log(uri)
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use global to prevent multiple instances
  const globalWithMongo = global as typeof global & { 
    _mongoClientPromise?: Promise<MongoClient> 
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new client each time
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;