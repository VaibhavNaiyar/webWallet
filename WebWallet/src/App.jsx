import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Plus, AlertTriangle, Shield } from 'lucide-react';

// Mock BIP-39 word list (first 100 words for demo)
const BIP39_WORDLIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'against', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest'
];

// Simplified crypto functions (for demo purposes)
const generateRandomBytes = (length) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const generateMnemonic = (strength = 128) => {
  const entropy = generateRandomBytes(strength / 8);
  const words = [];
  const wordCount = strength === 128 ? 12 : 24;
  
  for (let i = 0; i < wordCount; i++) {
    const index = Math.floor(Math.random() * BIP39_WORDLIST.length);
    words.push(BIP39_WORDLIST[index]);
  }
  return words.join(' ');
};

const deriveWalletFromSeed = (seed, accountIndex) => {
  // Simplified derivation for demo (not cryptographically secure)
  const hash = seed + accountIndex.toString();
  const privateKey = generateRandomBytes(32);
  const publicKey = '02' + generateRandomBytes(32);
  const address = '0x' + generateRandomBytes(20);
  
  return {
    privateKey: privateKey,
    publicKey: publicKey,
    address: address,
    path: `m/44'/60'/0'/0/${accountIndex}`
  };
};

function WalletGenerator() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [seedStrength, setSeedStrength] = useState(128);
  const [copiedItem, setCopiedItem] = useState('');

  const generateSeed = () => {
    const mnemonic = generateMnemonic(seedStrength);
    setSeedPhrase(mnemonic);
    setAccounts([]);
    setRevealedKeys(new Set());
  };

  const addAccount = () => {
    if (!seedPhrase) {
      alert('Please generate a seed phrase first!');
      return;
    }
    
    const newAccount = deriveWalletFromSeed(seedPhrase, accounts.length);
    setAccounts([...accounts, { ...newAccount, index: accounts.length }]);
  };

  const togglePrivateKeyVisibility = (index) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedKeys(newRevealed);
  };

  const copyToClipboard = async (text, item) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearWallet = () => {
    setSeedPhrase('');
    setAccounts([]);
    setRevealedKeys(new Set());
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#121212', color: '#FFFFFF' }}>
      <div className="w-full max-w-4xl" style={{ backgroundColor: '#1E1E1E', border: '1px solid #333', borderRadius: '12px', padding: '24px' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold" style={{ background: 'linear-gradient(45deg, #BB86FC, #6200EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HD Wallet Generator
            </h1>
          </div>
        </div>

        


        {/* Seed Generation Section */}
        <div style={{ backgroundColor: '#1E1E1E', border: '1px solid #333', borderRadius: '8px' }} className="p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: '#FFFFFF' }}>Generate Seed Phrase</h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="12words"
                name="strength"
                value={128}
                checked={seedStrength === 128}
                onChange={(e) => setSeedStrength(parseInt(e.target.value))}
                style={{ accentColor: '#6200EE' }}
              />
              <label htmlFor="12words" style={{ color: '#E0E0E0' }}>12 words</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="24words"
                name="strength"
                value={256}
                checked={seedStrength === 256}
                onChange={(e) => setSeedStrength(parseInt(e.target.value))}
                style={{ accentColor: '#6200EE' }}
              />
              <label htmlFor="24words" style={{ color: '#E0E0E0' }}>24 words</label>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={generateSeed}
              style={{ backgroundColor: '#6200EE', color: '#FFFFFF' }}
              className="hover:opacity-90 px-6 py-3 rounded-lg font-semibold transition-opacity"
            >
              Generate New Seed
            </button>
            {seedPhrase && (
              <button
                onClick={clearWallet}
                style={{ backgroundColor: '#D32F2F', color: '#FFFFFF' }}
                className="hover:opacity-90 px-6 py-3 rounded-lg font-semibold transition-opacity"
              >
                Clear Wallet
              </button>
            )}
          </div>

          {/* Seed Phrase Display */}
          {seedPhrase && (
            <div style={{ backgroundColor: '#2A2A2A', border: '1px solid #333', borderRadius: '8px' }} className="p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Your Seed Phrase</h3>
                <button
                  onClick={() => copyToClipboard(seedPhrase, 'seed')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  style={{ color: '#BB86FC' }}
                >
                  <Copy className="w-4 h-4" />
                  {copiedItem === 'seed' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                {seedPhrase.split(' ').map((word, index) => (
                  <div key={index} style={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }} className="p-2 rounded text-center text-sm">
                    <span style={{ color: '#E0E0E0' }} className="text-xs">{index + 1}.</span>
                    <div className="font-mono" style={{ color: '#FFFFFF' }}>{word}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Generation */}
        {seedPhrase && (
          <div style={{ backgroundColor: '#1E1E1E', border: '1px solid #333', borderRadius: '8px' }} className="p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>Wallet Accounts</h2>
              <button
                onClick={addAccount}
                className="flex items-center gap-2 hover:opacity-90 px-4 py-2 rounded-lg font-semibold transition-opacity"
                style={{ backgroundColor: '#6200EE', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-8" style={{ color: '#E0E0E0' }}>
                <p>No accounts generated yet. Click "Add Account" to create your first wallet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.index} style={{ backgroundColor: '#2A2A2A', border: '1px solid #333', borderRadius: '8px' }} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Account {account.index + 1}</h3>
                      <span className="text-sm font-mono" style={{ color: '#E0E0E0' }}>{account.path}</span>
                    </div>

                    <div className="grid gap-4">
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: '#E0E0E0' }}>Address</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 rounded text-sm font-mono break-all" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFFFFF' }}>
                            {account.address}
                          </code>
                          <button
                            onClick={() => copyToClipboard(account.address, `address-${account.index}`)}
                            className="hover:opacity-80 transition-opacity p-2"
                            style={{ color: '#BB86FC' }}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {copiedItem === `address-${account.index}` && (
                          <span className="text-xs" style={{ color: '#4CAF50' }}>Copied!</span>
                        )}
                      </div>

                      {/* Public Key */}
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: '#E0E0E0' }}>Public Key</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 rounded text-sm font-mono break-all" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFFFFF' }}>
                            {account.publicKey}
                          </code>
                          <button
                            onClick={() => copyToClipboard(account.publicKey, `public-${account.index}`)}
                            className="hover:opacity-80 transition-opacity p-2"
                            style={{ color: '#BB86FC' }}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {copiedItem === `public-${account.index}` && (
                          <span className="text-xs" style={{ color: '#4CAF50' }}>Copied!</span>
                        )}
                      </div>

                      {/* Private Key */}
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: '#E0E0E0' }}>Private Key</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 rounded text-sm font-mono break-all" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFFFFF' }}>
                            {revealedKeys.has(account.index) 
                              ? account.privateKey 
                              : '•'.repeat(64)
                            }
                          </code>
                          <button
                            onClick={() => togglePrivateKeyVisibility(account.index)}
                            className="hover:opacity-80 transition-opacity p-2"
                            style={{ color: '#FFD54F' }}
                          >
                            {revealedKeys.has(account.index) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          {revealedKeys.has(account.index) && (
                            <button
                              onClick={() => copyToClipboard(account.privateKey, `private-${account.index}`)}
                              className="hover:opacity-80 transition-opacity p-2"
                              style={{ color: '#BB86FC' }}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {copiedItem === `private-${account.index}` && (
                          <span className="text-xs" style={{ color: '#4CAF50' }}>Copied!</span>
                        )}
                        {revealedKeys.has(account.index) && (
                          <p className="text-xs mt-1" style={{ color: '#FF6B6B' }}>
                             Never share your private key with anyone!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default WalletGenerator;