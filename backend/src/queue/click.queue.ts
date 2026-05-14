import {Queue} from 'bullmq';

console.log("Queue Loaded");

export const clickQueue = new Queue('clickQueue',{
    connection:{
        host:"localhost",
        port:6379
    }
});

console.log("Queue Fine");