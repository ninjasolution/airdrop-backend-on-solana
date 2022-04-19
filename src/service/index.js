import { web3 } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import csv from "csv-parser";
import fs from "fs";
import pkg from 'bs58';
const { decode } = pkg;

class Service {

    constructor() {
      this.web3 = null;
    }

    toCluster(cluster) {
        switch (cluster) {
            case "devnet":
            case "testnet":
            case "mainnet-beta": {
                return cluster;
            }
        }
        throw new Error("Invalid cluster provided.");
    }

    async sendSPLTransaction() {

      let cluster = 'testnet';
      let url = web3.clusterApiUrl(this.toCluster(cluster), true);
      let connection = new web3.Connection(url, 'processed');
      let amounts = 0.5;
      // please replace secret key
      let SECRET_KEY = "4273ZFEmhfsXxt7bhwnZ6BUK95wpLWFin17YjxeyHxZdCuHbDaBNtVdFV6kJk8VDcGVSPPDs8NK4jv6ZTqbpoon3";
      const Uin8bytes = decode(SECRET_KEY)
      const fromWallet = web3.Keypair.fromSecretKey(Uint8Array.from(Uin8bytes));
      const tokenMintAddress = '9kSH9V8r1Cktu5AaAeS11SN5kDtMiJD36MFpBf8tUE8M';
      

      fs.createReadStream('./src/files/Test.csv')
      .pipe(csv())
      .on('data', async (row) => {
        console.log(row?.address, row?.amount);
        const to = new web3.PublicKey(row?.address);
        await this.tokenTransfer(tokenMintAddress, fromWallet, to, connection, row?.amount)

      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
    }

    async tokenTransfer(tokenMintAddress, wallet, to, connection, amounts) {
      let decimals = web3.LAMPORTS_PER_SOL;

      const mintPublicKey = new web3.PublicKey(tokenMintAddress);
      const mintToken = new Token(
        connection,
        mintPublicKey,
        TOKEN_PROGRAM_ID,
        wallet
      );
      const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
        wallet.publicKey
      );
      let instructions = [];

        const dest = to;
        const destPublicKey = new web3.PublicKey(dest);
        // const associatedDestinationTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(destPublicKey)
        const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
          mintToken.associatedProgramId,
          mintToken.programId,
          mintPublicKey,
          destPublicKey
        );
        const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
        if (receiverAccount === null) {
          instructions.push(
            Token.createAssociatedTokenAccountInstruction(
              mintToken.associatedProgramId,
              mintToken.programId,
              mintPublicKey,
              associatedDestinationTokenAddr,
              destPublicKey,
              wallet.publicKey
            )
          )
        }
        instructions.push(
          Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            associatedDestinationTokenAddr,
            wallet.publicKey,
            [],
            amounts * decimals
          )
        );
      const transaction = new web3.Transaction().add(...instructions);
      var signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [wallet]
      );
      console.log("SIGNATURE", signature);
      console.log("SUCCESS");

      return transaction;
    }
}

export default new Service();