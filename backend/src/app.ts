import { config } from './config';
import express from 'express';
import linkRouter from './routes/links.routes'; 
import redirecRoute from './routes/redirect';
import statRouter from './routes/stat.route';


const app = express();

app.use(express.json());

const port = config.PORT;

app.get('/health',(req,res)=>{
    res.json({status:'ok'});
});

app.use('/api',linkRouter);

app.use('/',statRouter);

app.use('/',redirecRoute);


app.listen(port,()=>{
    console.log(`trimTrack is running at port at ${port}`)
})
