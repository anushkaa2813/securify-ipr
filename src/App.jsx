import { useState, useEffect } from 'react';
import { contractAddress, contractABI } from './constants';
import { ethers } from 'ethers';
import { AiOutlineCopy } from 'react-icons/ai';
import { IoOpenOutline } from 'react-icons/io5';

import axios from 'axios';
import FormData from 'form-data';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';

function App() {  
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
    });

    const [connected, setConnected] = useState(false);
    const [cid, setCid] = useState('');
    const [signature, setSignature] = useState('');
    const [page, setPage] = useState('sign');
    const [account, setAccount] = useState('');
    const [showSignerInput, setShowSignerInput] = useState(false);
    const [signedTxData, setSignedTxData] = useState([]);
    const [receivedTxData, setReceivedTxData] = useState([]);
    const [language, setLanguage] = useState('en');

    const languages = {
        en: {
            connectWallet: "Connect Wallet",
            sign: "Sign",
            verify: "Verify",
            data: "Data",
            connected: "Connected: ",
            disconnect: "Logout",
            uploadIPFS: "Upload to IPFS",
            signCID: "Sign the CID",
            saveBlockchain: "Save to Blockchain",
            stepsInvolved: "Steps involved:",
            signInvolved: [
                "Upload patent to IPFS",
                "Sign the generated CID using the organization's private key",
                "Store the CID and signature in the blockchain along with the receiver's address and the message."
            ],
            selectFile: "Select File",
            placeholderReceiver: "Receiver address (0xed7852...)",
            placeholderMessage: "Certificate data",
            verifyTitle: "Verify IPR's Authenticity",
            verifySteps: [
                "Get the CID and the signature of the signer from the data section",
                "Paste the CID and signature in the provided input fields",
                "If you have the address of the organization, choose the option below and paste the organization's address as well",
                "Hit the button to get the signing authority in case you didn't provide the address, or the boolean value in case you did"
            ],
            getSignerAddress: "Get the signer address",
            checkValidity: "Get the confirmation for address",
            alreadySigner: "Already have the signer address? Try this",
            dontHaveSigner: "Don't have the signer address?",
            linkWallet: "Link Wallet to get Connected with us!!"
        },
        hi: {
            connectWallet: "बिटगेट वॉलेट से कनेक्ट करें",
            sign: "हस्ताक्षर करें",
            verify: "सत्यापित करें",
            data: "डेटा",
            connected: "कनेक्ट किया गया: ",
            disconnect: "लॉगआउट",
            uploadIPFS: "IPFS पर अपलोड करें",
            signCID: "CID पर हस्ताक्षर करें",
            saveBlockchain: "ब्लॉकचेन में सहेजें",
            stepsInvolved: "शामिल चरण:",
            signInvolved: [
                "पेटेंट को IPFS पर अपलोड करें",
                "संगठन की निजी कुंजी का उपयोग करके उत्पन्न CID पर हस्ताक्षर करें",
                "CID और हस्ताक्षर को ब्लॉकचेन में रिसीवर के पते और संदेश के साथ सहेजें।"
            ],
            selectFile: "फ़ाइल चुनें",
            placeholderReceiver: "रिसीवर का पता (0xed7852...)",
            placeholderMessage: "प्रमाण पत्र का डेटा",
            verifyTitle: "IPR की प्रामाणिकता सत्यापित करें",
            verifySteps: [
                "डेटा अनुभाग से साइनर का CID और हस्ताक्षर प्राप्त करें",
                "CID और हस्ताक्षर को दिए गए इनपुट फ़ील्ड में पेस्ट करें",
                "यदि आपके पास संगठन का पता है, तो नीचे दिए गए विकल्प को चुनें और संगठन का पता भी पेस्ट करें",
                "यदि आपने पता प्रदान नहीं किया है, तो साइनिंग प्राधिकरण प्राप्त करने के लिए बटन दबाएं, या यदि आपने प्रदान किया है, तो सत्यापन प्राप्त करें।"
            ],
            getSignerAddress: "साइनर का पता प्राप्त करें",
            checkValidity: "पते की पुष्टि प्राप्त करें",
            alreadySigner: "क्या आपके पास पहले से साइनर का पता है? इसे आजमाएं",
            dontHaveSigner: "क्या आपके पास साइनर का पता नहीं है?",
            linkWallet: "हमसे जुड़ने के लिए वॉलेट को लिंक करें!!"
        },
        // Add more languages here
    };
    

    const translate = (key) => {
        return languages[language][key];
    };

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }], // chainId must be in hexadecimal
                });
                setAccount(accounts[0]);

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                setState({ provider, signer, contract });
                setConnected(true);
            } else {
                alert('Please install MetaMask');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const disconnectWallet = () => {
        setConnected(false);
        setAccount('');
        setState({
            provider: null,
            signer: null,
            contract: null,
        });
    };

    const handleLanguageChange = (option) => {
        setLanguage(option.value);
    };

    async function uploadImg() {
        const formData = new FormData();
        const file = document.getElementById('file').files[0];
        if (!file) {
            toast.error('Please select the Patent Document First!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return;
        }
        formData.append('file', file);

        toast('Uploading...please wait', {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
                    'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_API_KEY,
                },
            }
        );
        setCid(response.data.IpfsHash);
    }

    async function getSignature() {
        if (!cid) {
            toast.error('Please upload the Patent to IPFS first!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return;
        }
        const packedMessage = ethers.utils.solidityPack(['string'], [cid]);
        const hash = ethers.utils.keccak256(packedMessage);

        const res = await window.ethereum.request({
            method: 'personal_sign',
            params: [account, hash],
        });
        setSignature(res);
    }

    async function checkValidity() {
        let signingAuthority = document.querySelector('#signer').value;
        if (signingAuthority[0] === '"') {
            signingAuthority = signingAuthority.substring(
                1,
                signingAuthority.length - 1
            );
        }
        const msg = document.querySelector('#msg').value;
        const signature = document.querySelector('#signature').value;
        const valid = await state.contract.verify(
            signingAuthority,
            msg,
            signature
        );
        document.querySelector('#valid').innerHTML = `<h1>${valid}</h1>`;
    }

    async function saveData() {
        const receiver = document.querySelector('#receiver').value;
        const message = document.querySelector('#message').value;

        toast.info('Transaction submitted to the blockchain!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        const saved = await state.contract.storeSignature(
            account,
            receiver,
            cid.toString(),
            signature,
            message
        );
        await saved.wait();
        toast.success('Data successfully stored in blockchain! Check the data section.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    }

    async function setSenderData() {
        if (state.contract) {
            const senderTxIds = await state.contract.retrieveSenderSignaturesTxIds(account);
            setSignedTxData([]);
            await senderTxIds.forEach(async (id) => {
                const transaction = await state.contract.getTransactionById(id);
                setSignedTxData((prev) => [...prev, transaction]);
            });
        }
    }

    async function setReceiverData() {
        if (state.contract) {
            const receiverTxIds = await state.contract.retrieveRecieverSignaturesTxIds(account);
            setReceivedTxData([]);
            await receiverTxIds.forEach(async (id) => {
                const transaction = await state.contract.getTransactionById(id);
                setReceivedTxData((prev) => [...prev, transaction]);
            });
        }
    }

    async function getSignerAddress() {
        const msg = document.querySelector('#msg').value;
        const signature = document.querySelector('#signature').value;
        const signerAddress = await state.contract.getSigner(msg, signature);
        document.querySelector('#valid').innerHTML = `<h1>${signerAddress}</h1>`;
    }

    return (
        <div className='bg-gradient-to-r from-blue-100 via-purple-200 to-pink-200 min-h-screen flex flex-col'>
            <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-red-500 p-6 shadow-lg rounded-lg mb-4">
                <div className="ml-8 text-3xl text-white font-bold">
                    Securify IPR
                </div>
                <div className="flex items-center">
                    <Dropdown
                        options={['en' , 'hi']}
                        onChange={handleLanguageChange}
                        value={language}
                        placeholder="Select a language"
                    />
                    {connected ? (
                        <button
                            onClick={disconnectWallet}
                            className="ml-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                        >
                            {translate('disconnect')}
                        </button>
                    ) : (
                        <button
                            onClick={connectWallet}
                            id="connect_button"
                            className="ml-4 bg-white text-purple-600 font-bold py-2 px-4 rounded-lg shadow-lg"
                        >
                            {translate('connectWallet')}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                {connected ? (
                    <div className="text-lg text-gray-700">
                        {translate('connected')} {account}
                    </div>
                ) : (
                    <div className="text-lg text-gray-700">
                        {translate('linkWallet')}
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-8">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                    <div className="flex justify-around mb-8">
                        <button
                            onClick={() => setPage('sign')}
                            className={`font-bold py-2 px-4 rounded-lg ${
                                page === 'sign'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {translate('sign')}
                        </button>
                        <button
                            onClick={() => setPage('verify')}
                            className={`font-bold py-2 px-4 rounded-lg ${
                                page === 'verify'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {translate('verify')}
                        </button>
                        <button
                            onClick={() => setPage('data')}
                            className={`font-bold py-2 px-4 rounded-lg ${
                                page === 'data'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {translate('data')}
                        </button>
                    </div>

                    {page === 'sign' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {translate('stepsInvolved')}
                            </h2>
                            <ol className="list-decimal ml-6 mb-8 text-gray-600">
                                {translate('signInvolved').map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>

                            <div className="mb-4">
                                <label className="block mb-2 font-bold text-gray-700">
                                    {translate('selectFile')}
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <button
                                    onClick={uploadImg}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    {translate('uploadIPFS')}
                                </button>
                            </div>

                            <div className="mb-4">
                                <button
                                    onClick={getSignature}
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    {translate('signCID')}
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 font-bold text-gray-700">
                                    {translate('placeholderReceiver')}
                                </label>
                                <input
                                    type="text"
                                    id="receiver"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder={translate('placeholderReceiver')}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 font-bold text-gray-700">
                                    {translate('placeholderMessage')}
                                </label>
                                <textarea
                                    id="message"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder={translate('placeholderMessage')}
                                />
                            </div>

                            <div className="mb-4">
                                <button
                                    onClick={saveData}
                                    className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    {translate('saveBlockchain')}
                                </button>
                            </div>
                        </div>
                    )}

                    {page === 'verify' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {translate('verifyTitle')}
                            </h2>
                            <ol className="list-decimal ml-6 mb-8 text-gray-600">
                                {translate('verifySteps').map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>

                            <div className="mb-4">
                                <label className="block mb-2 font-bold text-gray-700">
                                    CID
                                </label>
                                <input
                                    type="text"
                                    id="msg"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 font-bold text-gray-700">
                                    {translate('signature')}
                                </label>
                                <input
                                    type="text"
                                    id="signature"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <button
                                    onClick={() => setShowSignerInput(!showSignerInput)}
                                    className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    {showSignerInput
                                        ? translate('alreadySigner')
                                        : translate('dontHaveSigner')}
                                </button>
                            </div>

                            {showSignerInput ? (
                                <div className="mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">
                                        {translate('placeholderReceiver')}
                                    </label>
                                    <input
                                        type="text"
                                        id="signer"
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        placeholder={translate('placeholderReceiver')}
                                    />
                                    <button
                                        onClick={checkValidity}
                                        className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                    >
                                        {translate('checkValidity')}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={getSignerAddress}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    {translate('getSignerAddress')}
                                </button>
                            )}

                            <div className="mt-8" id="valid"></div>
                        </div>
                    )}

                    {page === 'data' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {translate('data')}
                            </h2>

                            <div className="mb-8">
                                <button
                                    onClick={setSenderData}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    Fetch Signed Data
                                </button>
                            </div>

                            {signedTxData.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-700">
                                        Signed Transactions
                                    </h3>
                                    {signedTxData.map((tx, index) => (
                                        <div key={index} className="border p-4 rounded-lg mb-4">
                                            <div>
                                                <strong>Receiver:</strong> {tx.receiver}
                                            </div>
                                            <div>
                                                <strong>CID:</strong> {tx.cid}
                                            </div>
                                            <div>
                                                <strong>Signature:</strong> {tx.signature}
                                            </div>
                                            <div>
                                                <strong>Message:</strong> {tx.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mb-8">
                                <button
                                    onClick={setReceiverData}
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                                >
                                    Fetch Received Data
                                </button>
                            </div>

                            {receivedTxData.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-700">
                                        Received Transactions
                                    </h3>
                                    {receivedTxData.map((tx, index) => (
                                        <div key={index} className="border p-4 rounded-lg mb-4">
                                            <div>
                                                <strong>Sender:</strong> {tx.sender}
                                            </div>
                                            <div>
                                                <strong>CID:</strong> {tx.cid}
                                            </div>
                                            <div>
                                                <strong>Signature:</strong> {tx.signature}
                                            </div>
                                            <div>
                                                <strong>Message:</strong> {tx.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
