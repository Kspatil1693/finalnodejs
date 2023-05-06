const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const employeeSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    birthdayDate:{
        type:Date,
        required:true

    },
    gender:{
        type:String,
        required:true
    },
    emailAddress:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    cpassword:{
        type:String,
        required:true,
        
    },
    phoneNumber:{
        type:Number,
        requried:true,
        unique:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
//generate the token
employeeSchema.methods.generateAuthToken=async function(){
    try{
        console.log(this._id);
        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
       this.tokens=this.tokens.concat({token:token});
       await this.save();
        console.log(token);
        return token;
    }catch(e){
        res.send("the error part"+e);
        console.log("the error part"+e);
    }
}

//generate the hash password
employeeSchema.pre("save",async function(next){
    //const passwordHash=await bcrypt.hash(password,10);
   if(this.isModified("password")){
   // console.log(`the current password is ${this.password}`);
    this.password=await bcrypt.hash(this.password,10);
    this.cpassword=await bcrypt.hash(this.password,10);
    //console.log(`the current password is${this.password}`);
    //this.cpassword=undefined;
   }
   next();
})

const Register=new mongoose.model("Register",employeeSchema);

module.exports=Register;