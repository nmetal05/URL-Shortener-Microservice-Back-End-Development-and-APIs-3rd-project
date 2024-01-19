require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const ejs = require('ejs')

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDB = []
// set up ejs
app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use((req,res,next)=>{
  res.locals.scripts=['/public/common.js']
  next()
})

/*app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});*/

app.get('/',function(req,res){
  const origin = req.protocol + '://' + req.get('host');
  res.render('index',{urlDB,origin})
})


 //define the database as an array to store the short url keys
let dbIndex = 1
const urlRegex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/ //regex for basic url validation
//url shortening microservice
app.post('/api/shorturl/',(req,res)=>{
  let url = req.body.url
  if(urlRegex.test(url)){
    let urlKey = dbIndex++
    urlDB.push({urlKey,url})
    res.json({original_url:url,short_url:urlKey})
  }else{
    res.json({error:"Invalid URL"})
  }
 })

//urlKey redirection
app.get('/api/shorturl/:link',(req,res)=>{
  let link = parseInt(req.params.link)
  let urlPlace = urlDB.find(item => item.urlKey==link)
  if(urlPlace){
    res.redirect(urlPlace.url)
  }else{
    res.json({error:"No short URL for the given index key"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
