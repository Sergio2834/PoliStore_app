import mongoose from "mongoose"; //installa mongoose con npm install mongoose prima di eseguire questo codice//

export async function connectToDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected: ", conn.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);
    }

}