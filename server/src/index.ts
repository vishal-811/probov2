import express from 'express';
import cors from 'cors';
const app = express();
import allRoutes from './routes/index'
import  { createClient }  from 'redis'
app.use(express.json());
app.use(cors());

export const client = createClient();
export const Subscriber = createClient();

app.use('/',allRoutes);

async function startServer(){
    try {
        await client.connect();  
        await Subscriber.connect();
        console.log("Connected to reddis");
    } catch (error) {
        console.log(error);
    }

    app.listen(3000,()=>{
        console.log("Server is listening on port 3000");
    })
}
startServer();