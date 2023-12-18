import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, fromNano, internal } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";

async function main() {
    const mnemonic = "";

    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({
        publicKey: key.publicKey,
        workchain: 0,
    });

    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    const balance = await client.getBalance(wallet.address);
    console.log("balance: ", fromNano(balance));

    //sending transaction
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
            internal({
                to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
                value: "0.05",
                body: "hey",
                bounce: false,
            }),
        ],
    });

    let currentSeqno = seqno;
    while (currentSeqno === seqno) {
        console.log("waiting for transaction to confirm");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed");
}

main();

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
