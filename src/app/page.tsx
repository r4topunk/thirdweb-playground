"use client";

import { ConnectButton } from "@/components/connect-button";
import { POAP_CONTRACT } from "@/constants";
import { getContract } from "@/lib/thirdweb/client";
import { useEffect, useState, useCallback } from "react";
import { getOwnedTokenIds } from "thirdweb/extensions/erc1155";
import NFTCard from "@/components/nft-card";
import { useActiveAccount } from "thirdweb/react";

type TokenBalance = {
  balance: bigint;
  tokenId: bigint;
};
const contract = getContract(POAP_CONTRACT);

export default function Page() {
  const [tokenIds, setTokenIds] = useState<TokenBalance[]>([]);
  const account = useActiveAccount();

  const fetchTokenIds = useCallback(() => {
    if (!account?.address) return;
    console.log("Getting token ids for", account.address);

    getOwnedTokenIds({
      contract,
      address: account.address,
    }).then(setTokenIds);
  }, [account?.address]);

  useEffect(() => {
    fetchTokenIds();
  }, [fetchTokenIds]);

  const handleTxSuccess = () => {
    fetchTokenIds();
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-full h-screen">
      <div className="min-h-[100vh] flex flex-col justify-center items-center flex-1 gap-4 rounded-xl bg-muted/50 md:min-h-min">
        Hello world
        <ConnectButton />
        {
          <div className="flex flex-col gap-4">
            {tokenIds.map((token) => (
              <NFTCard
                key={token.tokenId}
                token={token}
                onTxSuccess={handleTxSuccess}
              />
            ))}
          </div>
        }
      </div>
    </div>
  );
}
