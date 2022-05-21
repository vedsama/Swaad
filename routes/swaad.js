var express = require('express');
var router = express.Router();
var pool=require("./pool");
var upload = require("./multer");

var LocalStorage=require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage('./scratch');

router.get('/home',(req,res,next) => {
  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
  res.render('Home',{msg:''});
  else
  res.render("loginswaad",{msg:''})
});

router.get('/err',(req,res) =>{
  res.render('err',{msg:''})
})

router.get('/fetchallcategory',function(req,res){

    pool.query('select * from category',function(error,result){
  
    if(error)
    {
      res.status(500).json([])
    }
    else
    {
    
      res.status(200).json(result)
  
    }
  
    })
  })
  
    router.get('/fetchallfood',function(req,res){
  
      pool.query('select * from food where categoryid=?',[req.query.categoryid],function(error,result){
    
      if(error)
      {
        res.status(500).json([])
      }
      else
      {
        res.status(200).json(result)
    
      }
    
      })
    })


    router.post('/addnewrecord',upload.single('image'),(req,res) =>{
      console.log("BODY:",req.body)
      console.log("FILE",req.file)


      if(req.body.status_a =="on"){
        var status = "Available"
      }
      if(req.body.status_b =="on"){
        var status = "Not Available"
      }


      if(req.body.foodtype_v =="on"){
        var type = "Veg"
      }
      else if(req.body.foodtype_nv =="on"){
        var type = "Non Veg"
      }

      

      pool.query('insert into swaad(foodlistid,categoryid,foodid,type,ingredients,price,offerprice,image,status)values(?,?,?,?,?,?,?,?,?)',[req.body.foodlistid,req.body.categoryid,req.body.foodid,type,req.body.ingredients,req.body.price,req.body.offer,req.file.originalname,status],(error,result) =>{

        if(error){
          console.log("xxxxxxxxxxxxxxxxxxxxx",error)

          res.render('err',{msg:'server error,record not submitted'})
          
        }
        else{
          res.render('home',{msg:"record submitted successfully"})
        }
      })



    })


    router.get('/display', function(req, res, next) {
      var result=JSON.parse(localStorage.getItem('admin'))
      if(!result)
      res.render("loginswaad",{msg:''})
      pool.query('select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as cn,(select K.foodname from food K where K.foodid=F.foodid) as fn from swaad F',function(error,result){
    
        if(error)
        {
          console.log("xxxxxxxxxxxxxx",error)
          res.render('error' ,{data:[]});
        }
        else
        {
          console.log(result)
          res.render('display' ,{data:result});
      
        }
      })
      
    });

    router.get('/displaybyid',(req,res,next) =>{

      pool.query('select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as cn,(select K.foodname from food K where K.foodid=F.foodid) as fn from swaad F where F.foodlistid=?',[req.query.foodlistid],function(error,result){
    
        if(error)
        {
          console.log(error)
          
          res.render('displayfoodbyid' ,{data:[]});
        }
        else
        {
          console.log(result)
          res.render('displayfoodbyid' ,{data:result[0]});
      
        }
      })
      
    })

    router.post("/editdeleterecord",upload.single('logo'),function(req,res){
      console.log("BODY:",req.body)



      if(req.body.btn == "Edit"){

        if(req.body.status_a =="on"){
          var status = "Available"
        }
        if(req.body.status_b =="on"){
          var status = "Not Available"
        }
  
  
        if(req.body.foodtype_v =="on"){
          var type = "Veg"
        }
        else if(req.body.foodtype_nv =="on"){
          var type = "Non Veg"
        }
    
      pool.query("update swaad set categoryid=?,foodid=?,type=?,price=?,offerprice=?,status=?  where foodlistid=?",[  req.body.categoryid, req.body.foodid,type, req.body.price, req.body.offerprice, status, req.body.foodlistid ],function(error,result){
       if(error)
       { console.log("xxxxxxxxxxxxxxxxxxxxx",error)
        res.redirect("/swaad/display")
       }
       else
       {
         
        res.redirect("/swaad/display")
    
       }
    
      })
      }
    
      else if(req.body.btn == "Delete"){
        pool.query("delete from swaad   where foodlistid=?",[ req.body.foodlistid],function(error,result){
          if(error)
          { console.log("xxxxxxxxxxxxxxxxxxxxx",error)
           res.redirect("/swaad/display")
          }
          else
          {
            
           res.redirect("/swaad/display")
       
          }
       
         })
    
      }
      
    
     })




  

module.exports = router