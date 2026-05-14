import { Worker } from "bullmq";
import { config } from "../config";
import { ParsingData } from "../services/tracker";
console.log("Worker Loaded");
export const clickWorker = new Worker(
    "clickQueue",
    async(job)=>{
        //process job
        console.log("Inside Worker");
        const {
            short_code,
            ip,
            userAgent,
            referer
        }=job.data;

        console.log(job.data);
        await ParsingData(
            short_code,
            ip,
            userAgent,
            referer
        );

        console.log(`Parsing Data from Worker for ${short_code}`);
    },
    {
        connection:{
            host:"localhost",
            port:6379
        }
    }
)
console.log("Worker Fine")