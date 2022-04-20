import express from "express";
const airdrop = express.Router();
import service from "../service/index.js";

airdrop.get("/", async (req, res) => {
        
    let signature = await service.sendSPLTransaction();
    return res.send({signature});
})

export default airdrop;