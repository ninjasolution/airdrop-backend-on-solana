import service from "../service/index.js";

export default function (app) {

    app.get("/api/airdrop", async (req, res) => {
        
        service.sendSPLTransaction();
        res.send({success: true});
    })

}