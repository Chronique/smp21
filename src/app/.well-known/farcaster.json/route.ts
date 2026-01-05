import { METADATA } from "../../../lib/utils";

export async function GET() {
  const config = {
    accountAssociation: {
       "header": "eyJmaWQiOjM0NTk5MywidHlwZSI6ImF1dGgiLCJrZXkiOiIweDk2Q2MxN0M3N2E1MDREM0ZERDUxNmU2NjIxMzAzMDdFZjc0M2QzMEIifQ",
       "payload": "eyJkb21haW4iOiJzbXAtMjEtamFtYmkudmVyY2VsLmFwcCJ9",
       "signature": "igvm7+McN86HlZ/zB9kUxXu7rYjEt6yxRWBuob+8PvE3mwx3dftaqadFIK2vtj7b5391LGamft8soQn0iYiYUBw="
    },
      "frame": {
        "version": "1",
        "name": METADATA.name,
        "iconUrl": METADATA.iconImageUrl,
        "homeUrl": METADATA.homeUrl,
        "imageUrl": METADATA.bannerImageUrl,
        "webhookUrl": `${METADATA.homeUrl}/api/webhook`,
        "splashImageUrl": METADATA.iconImageUrl,
        "splashBackgroundColor": METADATA.splashBackgroundColor,
        "description": METADATA.description,
        "ogTitle": METADATA.name,
        "ogDescription": METADATA.description,
        "ogImageUrl": METADATA.bannerImageUrl,
        "primaryCategory": "developer-tools",
        "requiredCapabilities": [
          "actions.ready",
          "actions.signIn", 
          "actions.openMiniApp",
          "actions.addMiniApp",
          "actions.openUrl",
          "actions.sendToken",
          "actions.viewToken", 
          "actions.composeCast",
          "actions.viewProfile",
          "actions.swapToken",
          "actions.close",
          "actions.viewCast",
          "wallet.getEthereumProvider"
        ],
        "requiredChains": [
          "eip155:8453",
          "eip155:10"
        ],
        "noindex": false,
        "tags": ["base", "baseapp", "miniapp", "vote"]
      },
      "baseBuilder": {
        "allowedAddresses": ["0x4fba95e4772be6d37a0c931D00570Fe2c9675524"],
      }
  };

  return Response.json(config);
}
