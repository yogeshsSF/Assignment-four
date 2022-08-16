import express = require('express');
import router from "./routes/user";
import cors = require('cors');
const app = express();

app.use(express.json({limit: "30mb"}));
app.use(cors());

app.use('/user',router);

app.listen(9010);