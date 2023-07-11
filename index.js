import express from "express";
import mongoose from "mongoose";
mongoose.set("strictQuery",false);
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";



import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
//import openaiRoutes from "./routes/openai.js";
// import subsRoutes from "./routes/subs.js";


dotenv.config();
const app = express();



dotenv.config();
//const app = express();
app.use(cors());


//const router = express.Router()

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post("/chat", (req, res) => {
  const question = req.body.question;

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 4000,
      temperature: 0,
    })
    .then((response) => {
      console.log({ response });
      return response?.data?.choices?.[0]?.text;
    })
    .then((answer) => {
      console.log({ answer });
      const array = answer
        ?.split("\n")
        .filter((value) => value)
        .map((value) => value.trim());

      return array;
    })
    .then((answer) => {
      res.json({
        answer: answer,
        propt: question,
      });
    });
  console.log({ question });
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({limit:"30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors());


app.get('/',(req, res) => {
 res.send("This is a stack overflow clone API")
})

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
//app.use("/openai", openaiRoutes);
// app.use("/subs", subsRoutes);

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });



const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect( DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true} )
.then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
.catch((err) => console.log(err.message))

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  