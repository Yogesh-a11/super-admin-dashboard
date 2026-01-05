import express from 'express';
import 'dotenv/config';
import companyRouter from './Routes/companyRoute.js';
import { connectDB } from './config/db.js';

const app = express();
app.use(express.json());
connectDB();
 
app.use('/api/v1/companies', companyRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 