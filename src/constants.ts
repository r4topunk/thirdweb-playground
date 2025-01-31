import { base } from "thirdweb/chains";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const SERVICE_API_KEY = process.env.SERVICE_API_KEY!;
export const SERVICE_URL = process.env.NEXT_PUBLIC_SERVICE_URL!;

export const CHAIN = base;
export const ACCOUNT_FACTORY = "0x65E32f5375a0094fa81e71B1334c8dbb088A534c";
export const POAP_CONTRACT = "0x37536A7fE8DC506321018F358d7549F826b5329C";

export const r4to = "0x1fd1405aE28ef1855A0d26CE07555Be661405fCb";
