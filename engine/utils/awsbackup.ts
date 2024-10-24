import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs';
import { ORDERBOOK } from '../data/orderbook';

const Client = new S3Client({
    region : process.env.AWS_REGION || "eu-north-1",
    credentials:{
       secretAccessKey : process.env.SECRET_ACCESS_KEY || "",
       accessKeyId : process.env.ACCESS_KEY || ""
    }
})

const Bucket_name ='probo-backup' ;
const File_Key ='orderbook.json';

async function appendDataTOJsonfile(){
    fs.readFile('./utils/orderbook.json','utf-8', async (err, data)=>{
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }
         const orderbookData = await TakenewSnapshot();
            fs.writeFile('./utils/orderbook.json', JSON.stringify(orderbookData, null, 2), async (writeErr) => {
            if (writeErr) {
                console.error("Error writing to file:", writeErr);
            } else {
                console.log("Snapshot appended successfully!");
                await putdataintoS3(orderbookData);
            }
        });
    });
}


// Take a newsnapshot
async function TakenewSnapshot(){
    let updatedOrderbook;
    if(!ORDERBOOK || Object.keys(ORDERBOOK).length === 0){
        // get data from the s3 bucket.
     updatedOrderbook = await getdatafromS3();
    }
    else{
        updatedOrderbook = ORDERBOOK;
    }
    return updatedOrderbook;
}

async function putdataintoS3(data: any) {
    try {
        if (!Bucket_name || !File_Key) {
            throw new Error("Bucket name or file key is missing");
        }

        const command = new PutObjectCommand({
            Bucket: Bucket_name,
            Key: File_Key,
            Body: JSON.stringify(data, null, 2),
            ContentType: 'application/json', // Fixed content type
        });

        const response = await Client.send(command);
        console.log("Successfully uploaded to S3", response);
        
    } catch (error) {
        console.error("Failed to upload to S3:", error);
        throw error; // Re-throw to handle it in the calling function
    }
}


export async function getdatafromS3(){
   const command = new GetObjectCommand({
      Bucket : Bucket_name,
      Key : File_Key
   })
    try {
        const response = await Client.send(command); 
        const data = await response.Body?.transformToString();
        if(data){
         console.log("Successfully get the data from the s3 bucket.");
         return data;
        }
    } catch (error) {
        console.log("Error in getting data from S3 bucket");
    }
} 

getdatafromS3();

// Put snapshot data in s3 after every hour.
setInterval(()=>{
    appendDataTOJsonfile();
}, 60*60*1000);


      


