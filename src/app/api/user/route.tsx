import { UserFormData } from "@/components/user-form";
import { CHAIN, POAP_CONTRACT } from "@/constants";
import { updateRouteWithData } from "@/lib/redirect";
import { getStorageUrl, supabase } from "@/lib/supabase";
import { mintNewPoap, twClient } from "@/lib/thirdweb/server";
import { createUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { resolveScheme } from "thirdweb/storage";

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    console.log("Inserting user:", formData);

    const username = formData.get("username");
    const avatarFile = formData.get("avatar");
    let avatar: string | null = null;

    if (avatarFile) {
      if (avatarFile instanceof File) {
        const fileName = `avatarFile_${username}.${avatarFile.name
          .split(".")
          .pop()}`;
        const { data, error } = await supabase.storage
          .from("id_images")
          .upload(fileName, avatarFile, {
            upsert: true,
          });
        console.log(data, error);
        if (error) {
          console.error("Failed to upload avatarFile:", error);
          return NextResponse.json(
            { message: "Failed to upload avatarFile" },
            { status: 500 }
          );
        }
        avatar = getStorageUrl(fileName);
      } else if (typeof avatarFile === "string") {
        avatar = avatarFile;
      }
    }

    const address = formData.get("address");
    const nfc = formData.get("nfc");
    const email = formData.get("email");
    const bio = formData.get("bio");
    const x = formData.get("x");
    const instagram = formData.get("instagram");
    const tiktok = formData.get("tiktok");
    const shop = formData.get("shop");
    const contact_email = formData.get("contact_email");
    // const links = formData.get("links");

    if (!username || !address || !nfc || !email || !bio) {
      console.log(formData);
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!avatar) {
      avatar =
        "https://ggdqzqslplqnhrmcxwbr.supabase.co/storage/v1/object/public/id_images/oye_pfp.png";
    }

    const user: UserFormData = {
      username: username.toString(),
      address: address.toString(),
      nfc: nfc.toString(),
      email: email.toString(),
      bio: bio.toString(),
      avatar: avatar.toString(),
      links: [],
    };

    if (x) user.x = x.toString();
    if (instagram) user.instagram = instagram.toString();
    if (tiktok) user.tiktok = tiktok.toString();
    if (shop) user.shop = shop.toString();
    if (contact_email) user.contact_email = contact_email.toString();

    const { data, error, userCreated } = await createUser(user);

    if (error) {
      console.error("Failed to update route:", error);
      return NextResponse.json({ message: error }, { status: 500 });
    }

    if (userCreated) {
      // const contractAddress = "0x4D3423981762797Bc0381A6CeFd4D05B8B62bA70";
      const poapName = `You've met @${user.username} in Paris FW 25`;
      const uri = resolveScheme({
        uri: "ipfs://QmdLqeRVDghAzzLZFhpefaKvNzHAoHDfKG3xQeLdpaBhsL/piet%20paris%20fw%202025.jpg",
        client: twClient,
      });
      const newPoap = await mintNewPoap(POAP_CONTRACT, poapName, uri);
      if (newPoap) {
        console.log("Minted new POAP:", newPoap);
        await updateRouteWithData(data.nfc, {
          url: `https://id.ss-tm.org/user/${user.username}`,
          poapContract: POAP_CONTRACT,
          poapTokenId: newPoap.tokenId,
          chainId: CHAIN.id,
        });
      } else {
        console.error("Failed to mint new POAP");
      }
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error parsing request body:", err);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}
