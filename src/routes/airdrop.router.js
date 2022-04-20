import service from "../service/index.js";

export default function (app) {

    app.get("/api/airdrop", async (req, res) => {
        
        let signature = await service.sendSPLTransaction();
        return res.send({signature});
    })

}