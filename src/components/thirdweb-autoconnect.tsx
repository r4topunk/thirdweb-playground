"use client";

import { ACCOUNT_FACTORY, CHAIN } from "@/constants";
import { twClient } from "@/lib/thirdweb/client";
import { AutoConnect as TwAutoConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "google"],
    },
  }),
];

export default function AutoConnect() {
  return (
    <TwAutoConnect
      wallets={wallets}
      client={twClient}
      accountAbstraction={{
        chain: CHAIN,
        factoryAddress: ACCOUNT_FACTORY,
        gasless: true,
      }}
    />
  );
}
