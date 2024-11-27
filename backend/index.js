import express, { json } from "express"
import path from "path"
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000
import bcrypt from "bcrypt"
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
import mongoose from "mongoose";
const users = [];

const uri = "mongodb+srv://demouser:demo1234@cluster0.jzdiw.mongodb.net/user";

async function main() {
  try{
    const result = await mongoose.connect(uri);
    if(result){
      console.log("----------- connected----------")
    } else{
      console.log("----------- failed----------")
    }
  } catch(err){
    console.log("에러:", err)
    throw new Error("몽고db 데이터베이스 연결 오류")
  }
}
main().catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  role:{
    type: Number,
    enum: [0,1]
  },
  id:{
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  pw:{
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  phone:{
    type:Number,
  },
  sms:{
    type: String,
    enum:['y','n']
  },
  email:{
    type: String,
    trim: true
  }
},{
  timestamps: true
})

const User = mongoose.model('User',userSchema)

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html"))
})
app.post('/signup', async (req, res) => {
  try {
    const {user_gubun, user_id, user_pw, user_name, user_phone, user_sms, user_email}= req.body
    const hash_pw = bcrypt.hash(user_pw, saltRounds, async function(err, hash) {
      const user = await User.create({
        role: user_gubun,
        id: user_id,
        pw: hash,
        name: user_name,
        phone: user_phone,
        sms: user_sms,
        email: user_email,
      })
      if(!user){
        throw new Error("사용자 생성 실패")
      }
      res.send('<script>alert("회원가입 성공, 홈으로 이동합니다");location.href="/";</script>');
    })
  } catch(err){
    console.log(err)
    // throw new Error("회원가입 오류")
  } 
})
app.post('/signin', async (req, res) => {
  try{
    const {user_id, user_pw} = req.body;
    const foundUser = await User.find({id:user_id})
    if (foundUser.length ==0){
      res.status(401).json({
        status: 'fail',
        message: "사용자가 존재하지 않습니다"
      })
    }
    const match = await bcrypt.compare(user_pw, foundUser[0].pw)
    if(match){
      //cookie 굽기
      res.cookie('login_user', foundUser[0].id, {
        httpOnly: true,
        maxAge: 60000
      })
      res.status(200).json({
        status: 'success',
        message: '로그인 성공' 
      })
    } else{
      res.status(200).json({
        status: 'fail',
        message: '로그인 실패'
      })
    }
  } catch (err){
    console.log(err)
  }
})
app.get("/bucket", (req, res) => {
  try{
    if (req.cookies.login_user) {
      res.send("쿠키정보가 존재합니다")
    } else {
      res.status(401).json({
        status: 'fail',
        message: "로그인이 필요합니다"
      })
    }
  } catch(err){
    console.log(err)
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})