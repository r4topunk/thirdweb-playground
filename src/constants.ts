import { optimismSepolia } from "thirdweb/chains";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const SERVICE_API_KEY = process.env.SERVICE_API_KEY!;
export const SERVICE_URL = process.env.NEXT_PUBLIC_SERVICE_URL!;

export const CHAIN = optimismSepolia;
export const ACCOUNT_FACTORY = "0xA480309BFBd5e18be842972A05972FcFE8B47352";
export const POAP_CONTRACT = "0x4D3423981762797Bc0381A6CeFd4D05B8B62bA70";

export const r4to = "0x1fd1405aE28ef1855A0d26CE07555Be661405fCb";
