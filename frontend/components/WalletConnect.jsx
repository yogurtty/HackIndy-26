/**
 * Solana Phantom Wallet Connect
 *
 * Connects the user's Phantom wallet. If connected, we treat
 * the wallet as a membership token — premium features unlock
 * once we verify an active subscription on-chain.
 *
 * Phantom docs:           https://docs.phantom.app/solana/integrating-phantom
 * Solana wallet adapter:  https://github.com/solana-labs/wallet-adapter
 * @solana/web3.js docs:   https://solana-labs.github.io/solana-web3.js/
 */

import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Connect to Solana devnet for testing — switch to 'mainnet-beta' for prod
// Solana network docs: https://docs.solana.com/clusters
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export default function WalletConnect({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Check if Phantom is already connected on page load
  useEffect(() => {
    const { solana } = window;
    if (solana?.isPhantom && solana.isConnected) {
      setWalletAddress(solana.publicKey.toString());
      onConnect?.(solana.publicKey.toString());
    }
  }, []);

  async function connectWallet() {
    const { solana } = window;

    if (!solana?.isPhantom) {
      // Phantom not installed — send user to install it
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      // Phantom connect — prompts the user to approve
      const response = await solana.connect();
      const address  = response.publicKey.toString();
      setWalletAddress(address);
      onConnect?.(address);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setConnecting(false);
    }
  }

  async function disconnectWallet() {
    await window?.solana?.disconnect();
    setWalletAddress(null);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {walletAddress ? (
        <>
          {/* Show truncated address as membership badge */}
          <span style={{ fontSize: '13px', opacity: 0.7 }}>
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>
          <button onClick={disconnectWallet} style={{ fontSize: '12px' }}>
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={connectWallet} disabled={connecting}>
          {connecting ? 'Connecting...' : '🔗 Connect Wallet (Premium)'}
        </button>
      )}
    </div>
  );
}