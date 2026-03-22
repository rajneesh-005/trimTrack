import { config } from './config';
import express from 'express';


const app = express();

app.use(express.json());
const port = config.PORT;

app.get('/health',(req,res)=>{
    res.json({status:'ok'});
});
app.listen(port,()=>{
    console.log(`trimTrack is running at port at ${port}`)
})
