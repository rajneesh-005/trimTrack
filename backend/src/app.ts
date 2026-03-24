import { config } from './config';
import express from 'express';
import linkRouter from './routes/links.routes'


const app = express();

app.use(express.json());

const port = config.PORT;

app.get('/health',(req,res)=>{
    res.json({status:'ok'});
});

app.use('/api',linkRouter);

app.listen(port,()=>{
    console.log(`trimTrack is running at port at ${port}`)
})
