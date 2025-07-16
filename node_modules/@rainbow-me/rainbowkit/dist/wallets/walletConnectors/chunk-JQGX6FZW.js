import {
  isIOS
} from "./chunk-FJVNKOUD.js";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-XNKQBM6J.js";

// src/wallets/walletConnectors/walletConnectWallet/walletConnectWallet.ts
var walletConnectWallet = ({
  chains,
  options,
  projectId,
  version = "2"
}) => ({
  id: "walletConnect",
  name: "WalletConnect",
  iconUrl: async () => (await import("./walletConnectWallet-GTSESN7Q.js")).default,
  iconBackground: "#3b99fc",
  createConnector: () => {
    const ios = isIOS();
    const connector = version === "1" ? getWalletConnectConnector({
      version: "1",
      chains,
      options: {
        qrcode: ios,
        ...options
      }
    }) : getWalletConnectConnector({
      version: "2",
      chains,
      projectId,
      options: {
        showQrModal: ios,
        ...options
      }
    });
    const getUri = async () => getWalletConnectUri(connector, version);
    return {
      connector,
      ...ios ? {} : {
        mobile: { getUri },
        qrCode: { getUri }
      }
    };
  }
});

export {
  walletConnectWallet
};
