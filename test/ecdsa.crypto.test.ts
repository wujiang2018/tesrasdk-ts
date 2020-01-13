import { Address } from '../src/crypto';
import { PrivateKey } from '../src/crypto/PrivateKey';
import { Signature } from '../src/crypto/Signature';
import { str2hexstr } from '../src/utils';
import { SignatureScheme } from './../src/crypto/SignatureScheme';

describe('test sign and verify with ECDSAwithSHA256', () => {
    test('test sign and verify', () => {
        const pri = new PrivateKey('0fdbd5d046997da9959b1931c727c96d83dff19e8ec0244952c1e72d1cdb5bf4');
        const content = 'helloworld';
        const msg = str2hexstr(content);
        const signature = pri.sign(msg, SignatureScheme.ECDSAwithSHA256);
        console.log('hex: ' + signature.serializeHex());
        console.log('pk: ' + pri.getPublicKey().key);

        const pub = pri.getPublicKey();
        const result = pub.verify(msg, signature);
        expect(result).toBeTruthy();
    });

    test('test verify signature generated by Java SDK', () => {
        // tslint:disable-next-line:max-line-length
        const content = 'deviceCode=device79dd02d40eb6422bb1f7924c2a6b06af&nonce=1042961893&tstId=did:tst:AVRKWDig5TorzjCS5xphjgMnmdsT7KgsGD&timestamp=1535970123';
        const hexStr = str2hexstr(content);

        const pri = new PrivateKey('0fdbd5d046997da9959b1931c727c96d83dff19e8ec0244952c1e72d1cdb5bf4');
        const pub = pri.getPublicKey();

        // Signature from Java sdk in base64
        // tslint:disable-next-line:max-line-length
        const msg = new Buffer('AYUi0ZgY7ZGN9Msr42prWjsghbcQ6yGaRL34RSUwQr949JMXuhrbjWCYIO3UV1FbFbNKG0YZByYHkffu800pNMw=', 'base64').toString('hex');
        const sig = Signature.deserializeHex(msg);

        const result = pub.verify(hexStr, sig);
        expect(result).toBeTruthy();
    });

    test('tt', () => {
        const pri4 = new PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b98');
        const pub4 = pri4.getPublicKey();
        const address = Address.fromPubKey(pub4).toBase58();
        const tstId4 = 'did:tst:' + address;

        console.log('did: ' + tstId4);
        const req = {
            timestamp: 1535336885,
            tstId: address,
            nonce: 45348391,
            deviceCode: 'deviceCOde',
            sig: ''
        };
        const msg = 'deviceCode=' + req.deviceCode + '&nonce=' + req.nonce +
        '&tstId=' + req.tstId + '&timestamp=' + req.timestamp;
        const hexMsg = str2hexstr(msg);
        const sig = pri4.sign(hexMsg).serializeHex();
        req.sig = sig;
        console.log(req);
    });
});