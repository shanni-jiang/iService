const express=require("express")
const bodyParser=require("body-parser")
const https=require("https")
const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const saltRounds=10

mongoose.connect("mongodb+srv://sunnyJ2000:sunny2000@cluster0.tgmnn.mongodb.net/iserverDB?retryWrites=true&w=majority", {useNewUrlParser:true})

const memberSchema = new mongoose.Schema(
    {
        country:{type:String,required:true},
        fname:{type:String,required:true},
        lname:{type:String,required:true},
        email:{type:String,unique:true,
               validate(value){
            if (!validator.isEmail(value))
            {throw new Error('The email is not valid!')}
        }},
        password:{type:String,minlength:8,required:true},
        cpassword:{
            type:String,
            minlength:8,
            required:true,
            validate(value){
                if (!(value==this.password))
                {throw new Error('Two password is not the same!')}
                else{
                    const saltRounds=10
                    this.password=bcrypt.hashSync(this.password,saltRounds)
                    
                }

            }
        },
        address:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        zip:String,
        telephone:String
    }
)

const app=express()
app.use(bodyParser.urlencoded({extended:true}))


app.get('/register',(req,res)=>{
    
    res.sendFile(__dirname+"/index.html")
})
app.get('/404',(req,res)=>{
    res.sendFile(__dirname+"/404error.html")
})
app.post('/register',(rep,res)=>{
    const firstname=rep.body.first_name
    const lastname=rep.body.last_name
    const email=rep.body.email
    const Member =  mongoose.model('Member', memberSchema)
    const member1=new Member(
        {
            country:rep.body.country,
            fname:rep.body.first_name,
            lname:rep.body.last_name,
            email:rep.body.email,
            password:rep.body.password,
            cpassword:rep.body.cpassword,
            address:rep.body.address,
            city:rep.body.city,
            state:rep.body.state,
            zip:rep.body.zip,
            telephone:rep.body.telephone
        }
    )

     member1.save((err) =>{
         if (err)
     {console.log(err)}
     else
     {
        console.log("Successfull!")
        const data={
            members:[{
                email_address: email,
                status : "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME:lastname
                }
            }]
        }
        jsonData=JSON.stringify(data)
    
        const apiKey="8ae0730466af8531a2b77c677e0ef487-us5"
        const url="https://us5.api.mailchimp.com/3.0/lists/2e356d476e"
        const options={
            method:"POST",
            auth:"azi:8ae0730466af8531a2b77c677e0ef487-us5"
        }
        const request=https.request(url,options,(response)=>{
            response.on("data",(data)=>{
                console.log(JSON.parse(data))
    
            })
    
    
        })
        request.write(jsonData)
        request.end()
        console.log(firstname,lastname,email)
        if(res.statusCode==200){
            //res.sendFile(__dirname+"/login.html")
            res.redirect('https://blooming-cove-95467.herokuapp.com/login')
        }
        else{
            //res.sendFile(__dirname+"/404error.html")
            res.redirect('https://blooming-cove-95467.herokuapp.com/404')
        }
    }
     })

 
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}


app.listen(port,(req,res)=>{
    console.log("Server is running successfully!")
})

//const login=express()
//login.use(bodyParser.urlencoded({extended:true}))
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+"/login.html")

})
app.post('/login',(rep,res)=>{
    const email=rep.body.email
    const password=rep.body.password
    const Member =  mongoose.model('Member', memberSchema)
    Member.find({'email':email},['password'],function(err,docs){
        if(err){
            console.log(err)
            res.redirect('https://blooming-cove-95467.herokuapp.com/404')
        }
        const hash=docs[0].password
        //console.log(docs[0].password)
        bcrypt.compare(password, hash).then(function(result) {
            if (result == true){
                res.redirect('https://code.visualstudio.com/docs/editor/versioncontrol')
                console.log("login success!")
            }
            else{
                console.log("Hash is "+hash)
                console.log("Password is "+password)
                res.redirect('https://blooming-cove-95467.herokuapp.com/404')
            }
        });
    })


})
// login.listen(8081,(req,res)=>{
//     console.log("Server is running on port 8081")
// })