require('dotenv').config();
const express=require("express");
require("./db/conn");
const path=require("path");
const hbs=require("hbs");
const port=process.env.PORT || 3001;
const app=express();
const Register=require("./models/registers");
const bcrypt=require("bcrypt");

const static_path=path.join(__dirname,"../public");
const templates_path=path.join(__dirname,"./templates/views");
const partials_Path=path.join(__dirname,"./templates/partials");


app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templates_path);
hbs.registerPartials(partials_Path);




app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
 })   

  app.get("/login",(req,res)=>{
    res.render("login");
 })   

 //create a new employee
 app.post("/register",async(req,res)=>{
    try{
         const password=req.body.password;
         const cpassword=req.body.cpassword;

         if(password === cpassword){

            const createData= new Register({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                birthdayDate:req.body.birthdayDate,
                gender:req.body.gender,
                emailAddress:req.body.emailAddress,
                password:req.body.password,
                cpassword:req.body.cpassword,
                phoneNumber:req.body.phoneNumber
            })
            console.log("the success part"+createData);

            const token=await createData.generateAuthToken();
             console.log("the token part"+token)

            const registerData=await createData.save();
            console.log("the page part"+registerData);
            res.status(200).render("index");
         }else
         {
            res.send("password are not matching");
         }

       // console.log(req.body.firstName);
       // res.send(req.body.firstName);
        }
         catch(e){
         res.status(400).send(e);
         console.log(" the error page")
    }
 })
      //login check
      app.post("/login",async(req,res)=>{
        try{
             const email=req.body.emailAddress;
             const password=req.body.password;
             
             const useremail=await Register.findOne({emailAddress:email});
             
             const isMatch= await bcrypt.compare(password,useremail.password);

             
            const token=await useremail.generateAuthToken();
            console.log("the token part"+token);

           // if(useremail.password === password)
           if(isMatch)
             {
                res.status(201).render("index");
             }
             else
             {
                res.send("Invalid login details");
             }
             //console.log(`${email} password is ${password}`);
      
       }catch(e){
            res.status(400).send(e);
        }
      })
      console.log(process.env.SECRET_KEY);

  /* // How to use the bcrypt js
   const bcrypt= require("bcrypt");
   const securePassword=async(password)=>{
    
    const passwordHash=await bcrypt.hash(password,10);
    console.log(passwordHash);

    const passwordMatch=await bcrypt.compare("123456789",passwordHash);
    console.log(passwordMatch);
   }
   securePassword("123456789"); */


/*//How to generate the json web token
const jwt=require("jsonwebtoken");
const createToken = async ()=>{
    const token= await jwt.sign({_id:"6454da1268d897f86768a681"},"mynameiskarishmadilippawarnarendra",{  expiresIn:"2 seconds"});
    //expire token
  
    console.log(token);
//verify the jwt token
const userVer=await jwt.verify(token,"mynameiskarishmadilippawarnarendra");
console.log(userVer);
}
createToken();*/

app.listen(port,(req,res)=>{
    console.log(`Server is start on port ${port}`);
});