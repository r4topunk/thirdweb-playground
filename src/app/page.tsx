import { ConnectButton } from "@/components/connect-button";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-full h-screen">
      <div className="min-h-[100vh] flex flex-col justify-center items-center flex-1 gap-4 rounded-xl bg-muted/50 md:min-h-min">
        Hello world
        <ConnectButton />
      </div>
    </div>
  );
}
