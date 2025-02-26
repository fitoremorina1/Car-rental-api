const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./config/rent");
const userRouter = require("./routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


connectDb();

app.use(express.json());


app.use("/api/v1/user", userRouter);


app.get("/", (req, res) => {
    res.send("Welcome to Car rental Api ");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});