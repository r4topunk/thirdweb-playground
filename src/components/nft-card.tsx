import { Button } from "@/components/ui/button";
import { NFTMedia, NFTName, NFTProvider } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { POAP_CONTRACT } from "@/constants";
import { getContract } from "@/lib/thirdweb/client";
import { useEffect } from "react";

type TokenBalance = {
  balance: bigint;
  tokenId: bigint;
};

const contract = getContract(POAP_CONTRACT);

const NFTCard = ({
  token,
  onTxSuccess,
}: {
  token: TokenBalance;
  onTxSuccess: () => void;
}) => {
  const account = useActiveAccount();
  const {
    mutate: sendTx,
    data: txData,
    isPending: txPending,
    isSuccess: txSuccess,
  } = useSendTransaction();

  useEffect(() => {
    if (txSuccess) {
      onTxSuccess();
    }

    if (txData?.transactionHash)
      console.log(
        `Burned token ${token.tokenId} with tx:`,
        txData.transactionHash
      );
  }, [txSuccess]);

  const handleClick = () => {
    if (!account?.address) return;

    const transaction = prepareContractCall({
      contract,
      method: "function burn(address account, uint256 id, uint256 value)",
      params: [account.address, token.tokenId, 1n],
    });
    sendTx(transaction);
  };

  return (
    <NFTProvider contract={contract} tokenId={token.tokenId}>
      <div className="flex flex-col gap-2 p-2 rounded-lg border border-gray-300">
        <div className="w-full flex justify-center items-center text-xl font-medium gap-1">
          <p className="text-muted-foreground">{token.tokenId.toString()}</p>
          <NFTName />
          <p className="text-xs text-muted-foreground">
            [{token.balance.toString()}]
          </p>
        </div>
        <NFTMedia className="rounded-md" />
        <Button onClick={handleClick} className="w-full" disabled={txPending}>
          {txPending ? "Burning..." : "Burn"}
        </Button>
      </div>
    </NFTProvider>
  );
};

export default NFTCard;
