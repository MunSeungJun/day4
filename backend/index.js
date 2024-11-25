import express, { json } from "express"
import path from "path"
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
      res.status(200).json(user)
      // res.send("회원가입 성공.");
    })
  } catch(err){
    console.log(err)
    // throw new Error("회원가입 오류")
  } 
})
app.get('/signin', (req, res) => {
  res.send("/signin 페이지를 보고 계십니다.")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})