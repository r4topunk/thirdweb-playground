"use client";

import { ConnectButton } from "@/components/connect-button";
import { Button } from "@/components/ui/button";
import { POAP_CONTRACT } from "@/constants";
import { getContract } from "@/lib/thirdweb/client";
import { useEffect, useState } from "react";
import { prepareContractCall } from "thirdweb";
import { getOwnedTokenIds } from "thirdweb/extensions/erc1155";
import {
  NFTMedia,
  NFTName,
  NFTProvider,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";

type TokenBalance = {
  balance: bigint;
  tokenId: bigint;
};
const contract = getContract(POAP_CONTRACT);

export default function Page() {
  const [tokenIds, setTokenIds] = useState<TokenBalance[]>([]);
  const account = useActiveAccount();
  const {
    mutate: sendTx,
    data: txData,
    isPending: txPending,
    isSuccess: txSuccess,
  } = useSendTransaction();

  useEffect(() => {
    if (!account?.address) return;
    console.log("Getting token ids for", account.address);

    getOwnedTokenIds({
      contract,
      address: account.address,
    }).then(setTokenIds);
  }, [account?.address, txSuccess]);

  const handleClick = (token: TokenBalance) => {
    if (!account?.address) return;

    console.log("Burning token", token.tokenId);

    const transaction = prepareContractCall({
      contract,
      method: "function burn(address account, uint256 id, uint256 value)",
      params: [account?.address, token.tokenId, 1n],
    });
    sendTx(transaction);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-full h-screen">
      <div className="min-h-[100vh] flex flex-col justify-center items-center flex-1 gap-4 rounded-xl bg-muted/50 md:min-h-min">
        Hello world
        <ConnectButton />
        {txData?.transactionHash ? (
          <p className="text-center">{txData.transactionHash}</p>
        ) : null}
        {
          <div className="flex flex-col gap-4">
            {tokenIds.map((token) => (
              <NFTProvider
                contract={contract}
                tokenId={token.tokenId}
                key={token.tokenId}
              >
                <div className="flex flex-col gap-2 p-2 rounded-lg border border-gray-300">
                  <div className="w-full flex justify-center items-center text-xl font-medium gap-1">
                    <p className="text-muted-foreground">
                      {token.tokenId.toString()}
                    </p>
                    <NFTName />
                    <p className="text-xs text-muted-foreground">
                      [{token.balance.toString()}]
                    </p>
                  </div>
                  <NFTMedia className="rounded-md" />
                  <Button
                    onClick={() => handleClick(token)}
                    className="w-full"
                    disabled={txPending}
                  >
                    {txPending ? "Burning..." : "Burn"}
                  </Button>
                </div>
              </NFTProvider>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
