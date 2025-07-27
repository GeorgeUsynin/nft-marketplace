import { BrowserProvider, ethers } from 'ethers';
import { createStore } from 'zustand/vanilla';

const SEPOLIA_NETWORK_ID = '0xaa36a7';

export type WalletState = {
  currentConnection: {
    provider: BrowserProvider | undefined;
    shop: any | undefined;
    signer: ethers.JsonRpcSigner | undefined;
  };
  isMetamaskInjected: boolean;
  networkError: null | string;
};

export type WalletActions = {
  _connectWallet: () => Promise<void>;
  _checkNetwork: () => Promise<boolean>;
  _initialize: (selectedAccount: string) => Promise<void>;
  _resetState: () => void;
};

export type WalletStore = WalletState & WalletActions;

export const defaultInitState: WalletState = {
  currentConnection: {
    provider: undefined,
    shop: undefined,
    signer: undefined,
  },
  isMetamaskInjected: false,
  networkError: null,
};

export const createWalletStore = (
  initState: WalletState = defaultInitState,
) => {
  const stateWithMetamaskCheck = {
    ...initState,
    isMetamaskInjected: typeof window !== 'undefined' && !!window.ethereum,
  };

  return createStore<WalletStore>()((set, get) => ({
    ...stateWithMetamaskCheck,
    _checkNetwork: async (): Promise<boolean> => {
      try {
        const chosenChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (chosenChainId === SEPOLIA_NETWORK_ID) {
          set({ networkError: null });
          return true;
        }

        set({
          networkError: 'Please connect to Sepolia network!',
        });
        return false;
      } catch (err) {
        set({ networkError: 'Failed to check network.' });
        return false;
      }
    },
    _connectWallet: async (): Promise<void> => {
      const { isMetamaskInjected, _checkNetwork, _initialize, _resetState } =
        get();

      if (!isMetamaskInjected) {
        set({ networkError: 'Please install Metamask!' });
        return;
      }

      if (!(await _checkNetwork())) return;

      const [selectedAccount] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      await _initialize(ethers.getAddress(selectedAccount));

      window.ethereum.on(
        'accountsChanged',
        async ([newAccount]: [newAccount: string]) => {
          if (newAccount === undefined) {
            _resetState();
            return;
          }

          await _initialize(ethers.getAddress(newAccount));
        },
      );

      window.ethereum.on('chainChanged', () => _resetState());
    },
    _initialize: async (selectedAccount: string): Promise<void> => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(selectedAccount);

      set({
        currentConnection: {
          provider,
          signer,
          // shop: MusicShop__factory.connect(MUSIC_SHOP_ADDRESS, signer),
          shop: undefined,
        },
      });
    },
    _resetState: () =>
      set({
        networkError: defaultInitState.networkError,
        currentConnection: defaultInitState.currentConnection,
      }),
  }));
};
