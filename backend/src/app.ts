import { config } from './config';
import express from 'express';
import linkRouter from './routes/links.routes'; 
import redirecRoute from './routes/redirect';
import statRouter from './routes/stat.route';
import authRoute from './routes/auth.route'
import { authMiddleware } from './middlewares/authMiddleware';


const app = express();

app.use(express.json());

const port = config.PORT;

app.get('/health',(req,res)=>{
    res.json({status:'ok'});
});
app.use('/api',authRoute);

app.use('/api',authMiddleware,linkRouter);

app.use('/',authMiddleware,statRouter);

app.use('/',redirecRoute);


app.listen(port,()=>{
    console.log(`trimTrack is running at port at ${port}`)
})
