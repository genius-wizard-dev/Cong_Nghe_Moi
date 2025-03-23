const express = require('express')
require('dotenv').config();
const app = express()

app.use(express.json({extended: false}))
app.use(express.static('./views'))
app.set('view engine', 'ejs')
app.set('views', './views')

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');


const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const documentClient = DynamoDBDocumentClient.from(client);
const tableName = 'SanPham'

const multer = require('multer')
const upload = multer()

app.post('/', upload.fields([]), async (req, res) => {
  const {ma_sp, ten_sp, so_luong} = req.body
  const params = {
    TableName: tableName,
    Item: {
      id: parseInt(ma_sp) || 0,
      ten_sp: ten_sp,
      so_luong: so_luong
    }
  }
  try {
    const command = new PutCommand(params);
    await documentClient.send(command);
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.send('Internal Server Error');
  }
})

app.get('/', async (req, res) => {
  const params = {
    TableName: tableName,
  };

  try {
    const command = new ScanCommand(params);
    const data = await documentClient.send(command);
    return res.render('index', { sanPhams: data.Items });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
});

app.post('/delete', upload.fields([]), async (req, res) => {
  const ids = req.body.ids; 
  if (!ids || ids.length === 0) {
    return res.redirect('/');
  }
  try {
    for (const id of ids) {
      const params = {
        TableName: tableName,
        Key: {
          id: parseInt(id)
        }
      };
      const command = new DeleteCommand(params);
      await documentClient.send(command);
    }
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
