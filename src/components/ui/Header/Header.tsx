'use client';

import { Button } from '@/components/ui/base';
import { toast } from 'sonner';
import { useWalletStore } from '@/stores/wallet-store-provider';
import { useEffect } from 'react';

const Header = () => {
  const { currentConnection, networkError, _connectWallet } = useWalletStore(
    (state) => state,
  );

  const walletButtonText = !!currentConnection.signer
    ? 'Wallet connected'
    : 'Connect Wallet';

  useEffect(() => {
    if (networkError) {
      toast(networkError);
    }
  }, [networkError]);

  return (
    <div className="flex justify-end items-center w-full p-10">
      {currentConnection.signer && (
        <p className="text-lime-400 mr-auto">
          Your address: {currentConnection.signer.address}
        </p>
      )}
      <Button disabled={!!currentConnection.signer} onClick={_connectWallet}>
        {walletButtonText}
      </Button>
    </div>
  );
};

export default Header;
