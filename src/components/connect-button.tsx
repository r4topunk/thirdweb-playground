"use client";

import { ACCOUNT_FACTORY, CHAIN } from "@/constants";
import { twClient } from "@/lib/thirdweb/client";
import { useTheme } from "next-themes";
import {
  darkTheme,
  lightTheme,
  ConnectButton as ThirdWebConnectButton,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

export const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "google"],
    },
  }),
];

const buttonColors = {
  colors: {
    accentText: "hsl(25, 95%, 53%)",
    accentButtonBg: "hsl(25, 95%, 53%)",
    primaryButtonBg: "hsl(25, 95%, 53%)",
    primaryButtonText: "hsl(240, 6%, 94%)",
  },
};

export function ConnectButton() {
  const theme = useTheme();

  return (
    <ThirdWebConnectButton
      theme={
        theme.theme === "dark"
          ? darkTheme(buttonColors)
          : lightTheme(buttonColors)
      }
      client={twClient}
      wallets={wallets}
      accountAbstraction={{
        chain: CHAIN,
        factoryAddress: ACCOUNT_FACTORY,
        gasless: true,
      }}
      connectModal={{
        size: "compact",
        showThirdwebBranding: false,
      }}
      detailsModal={{
        hideSwitchWallet: true,
        hideBuyFunds: true,
        hideSendFunds: true,
        hideReceiveFunds: true,
      }}
    />
  );
}
