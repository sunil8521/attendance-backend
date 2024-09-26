import express from "express";
import Web3 from "web3";
import { config } from "dotenv";
import {contractABI} from "./ABI.js"
config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC));

const contractAddress = "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922"; 

const attendanceContract = new web3.eth.Contract(contractABI, contractAddress);

// const provider = await web3ModalRef.current.connect()
// const provider1 = new ethers.BrowserProvider(window.ethereum, 43113);
// const contractInstance = new Contract({
//     contractAddress,
//     contractABI,
//     provider
    
// })


app.get("/", (req, res) => {
  res.json({ message: "blockchain" });
});
app.post("/add-student", async (req, res) => {
  const { name, rollNo, branch, account } = req.body;

  try {
    const transaction = await attendanceContract.methods
      .addStudent(name, rollNo, branch)
      .send({ from: account });

    res.json({
      message: "Student registered",
      transactionHash: transaction.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance for a student
app.post("/mark-attendance", async (req, res) => {
  const { rollNo, isPresent, account } = req.body;

  try {
    const transaction = await attendanceContract.methods
      .markAttendance(rollNo, isPresent)
      .send({ from: account });

    res.json({
      message: "Attendance marked",
      transactionHash: transaction.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance for a student by roll number
app.get("/get-attendance/:rollNo", async (req, res) => {
  const { rollNo } = req.params;

  try {
    const attendance = await attendanceContract.methods
      .getAttendance(rollNo)
      .call();
    const isPresent = attendance[0];
    const timestamp = attendance[1];

    res.json({
      rollNo,
      isPresent,
      timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
