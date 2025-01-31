import { createThirdwebClient } from "thirdweb";

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  throw new Error(
    "NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable is required."
  );
}

export const twClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});
