var express = require('express');
var router = express.Router();
var net = require('net');

var result = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async(req,res,next) => 
{
  var HOST = req.body.host;

  var PORT_START = req.body.port1;
  
  var PORT_END = req.body.port2;

  if
  (
      HOST == "" && 
      PORT_START == "" && 
      PORT_END == ""
  )
  {
     res.status(401).json({msg:"Host & Port Range are missing"})
     res.end()
  }
  
  else if
  (
      PORT_START < 0 || 
      PORT_START > 65536 || 
      PORT_END < 0 || 
      PORT_END > 65536
  )
  {
      res.status(401).json({msg:"Port Range should be between 0 - 65536"})
      res.end()
  }
  
  else
  {
     async function scan()
     {
          for(let x = PORT_START; x <= PORT_END; x++)
          {
              try
              {
                  await connect(HOST,x);
                  result.push(x);
              }
      
              catch(e)
              { 
              }
          }
          
          res.status(200).json({msg:result})
          res.end();
     }
  
     async function connect(host,port)
     {
         return new Promise((res,rej) =>
         {
             const client = new net.Socket();
             client.connect({host:host,port:port}, () => 
             {
                 res(true);
             }).on("error", err =>
             {
                 rej(err);
             })
         })
     }
  
     scan();
  }
})

module.exports = router;
