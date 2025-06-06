const express = require('express');
const cors = require('cors');
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/generate-seed', (req, res) => {
    const mnemonic = bip39.generateMnemonic();
    res.json({ seedPhrase: mnemonic });
});

app.post('/generate-wallet', async (req, res) => {
    const { seedPhrase } = req.body;
    if (!bip39.validateMnemonic(seedPhrase)) {
        return res.status(400).json({ error: 'Invalid seed phrase' });
    }

    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const wallet = hdWallet.derivePath("m/44'/60'/0'/0/0").getWallet();

    const privateKey = wallet.getPrivateKeyString();
    const publicKey = wallet.getPublicKeyString();
    const address = wallet.getAddressString();

    res.json({ address, publicKey, privateKey });
});

app.listen(5000, () => {
    console.log('✅ Backend running at http://localhost:5000');
});
