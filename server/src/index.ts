import express, {Request, Response} from 'express';
import cors from 'cors';
const app = express();
import allRoutes from './routes/index'
import  { createClient }  from 'redis'
app.use(express.json());
app.use(cors());

export const client = createClient({
     url : "redis://probov2-redis:6379"
});
export const Subscriber = createClient({
      url : "redis://probov2-redis:6379"
});

app.use('/',allRoutes);

app.get("/health",(req:Request, res: Response) => {
    res.status(200).json({msg :"Ok"});
})

async function startServer(){
    try {
        await client.connect();  
        await Subscriber.connect();
        console.log("Connected to redis");
    } catch (error) {
        console.log(error); 
    }

    app.listen(3000,()=>{
        console.log("Server is listening on port 3000");
    })
}
startServer();