import express from "express"
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
const users = [];


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html"))
})
app.post('/signup', (req, res) => {
  const {user_gubun, user_id, user_pw, user_name, user_phone, user_sms, user_email, user_file}= req.body;
  bcrypt.hash(user_pw, saltRounds, function(err, hash) {
    users.push({
      type: user_gubun,
      id: user_id,
      pw: hash,
      name: user_name,
      phone: user_phone,
      sms: user_sms ? "y": "n",
      email: user_email,
      file:user_file
    });
    console.log(users);
  })
  res.send("회원가입 성공.");
})
app.get('/signin', (req, res) => {
  res.send("/signin 페이지를 보고 계십니다.")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})