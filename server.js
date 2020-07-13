import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {getFreezers} from './api-queries/freezers.js'
import {getUsers, postUser, postLogin, putUsers} from './api-queries/users.js';
import {getProjects, putProjects, postProject} from './api-queries/projects.js' ;
import {getSamples, deleteSampleRows, getBoxSamples, getSStatus, putSamples, getSample, postSamples, getSampleStore} from './api-queries/samples.js';
//const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 4001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
  });

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/static', 'index.html'));})

app.get('/api/samples',getSamples)
app.get('/api/users', getUsers)
app.post('/api/users',postUser)
app.get('/api/projects',getProjects)
app.get('/api/s_status',getSStatus)
app.put('/api/samples', putSamples)
app.put('/api/users', putUsers)
app.put('/api/projects', putProjects)
app.post('/api/samples', postSamples)
app.post('/api/projects', postProject)
app.get('/api/get_avail_store', getSampleStore)
app.post('/api/login', postLogin)
app.get('/api/boxsamples', getBoxSamples)
app.get('/api/freezers', getFreezers)
app.delete('/api/samples', deleteSampleRows)
