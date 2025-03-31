import mongoose from "mongoose";

// Add mongoose to the global scope types
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URL = process.env.MONGODB_URL!;

if(!MONGODB_URL){
    throw new Error("Please define mongodb url in env file")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null, promise:null}
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
         
        const opts ={
            bufferCommands:true,
            maxPoolSize:10,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 20000
        }
        cached.promise=(mongoose
            .connect(MONGODB_URL,opts))
            .then((mongoose) => mongoose)
    }

    try{
        cached.conn= await cached.promise
    }catch(error){
        cached.promise=null
        console.error("MongoDB connection error:", error);
        throw error
    }
    return cached.conn

}