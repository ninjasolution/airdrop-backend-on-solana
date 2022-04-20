import service from "../service/index.js";

export default function (app) {

    app.get("/api/airdrop", async (req, res) => {
        
        await service.sendSPLTransaction();
        return res.send({success: true});
    })

}