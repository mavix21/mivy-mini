import { NextRequest, NextResponse } from 'next/server';
import { Synapse, RPC_URLS } from '@filoz/synapse-sdk';
import { ethers } from 'ethers';

// Force dynamic to ensure this doesn't get statically optimized
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // 1. Parse the incoming JSON body instead of FormData
        // Expecting a body like: { "content": "# My Post...", "title": "My Title" }
        const body = await req.json();
        const { content, title } = body;

        if (!content) {
            return NextResponse.json({ error: 'No content provided' }, { status: 400 });
        }

        // 2. Convert the Markdown string to a Uint8Array (Buffer)
        const fileData = new TextEncoder().encode(content);

        const privateKey = process.env.SYNAPSE_PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // 3. Initialize Synapse
        const synapse = await Synapse.create({
            privateKey: privateKey,
            rpcURL: RPC_URLS.calibration.http,
        });

        // 4. Create Storage Context with updated Metadata
        const context = await synapse.storage.createContext({
            withCDN: true,
            metadata: {
                Application: "My DApp Blog",
                Version: "1.0.0",
                Category: "Posts",
                Title: title || "Untitled",
                ContentType: "text/markdown", // Helpful for frontends to know how to render it
                Created: new Date().toISOString()
            }
        });

        // 5. Upload the data
        const uploadResult = await synapse.storage.upload(fileData, { context });

        const pieceCidStr = uploadResult.pieceCid.toString();
        // Fallback logic to get the IPFS CID (root CID)
        const ipfsCidStr = (uploadResult as any).root?.toString() || (uploadResult as any).cid?.toString() || pieceCidStr;

        console.log(`✅ Upload complete! PieceCID: ${pieceCidStr}`);
        const storageInfo = await synapse.storage.getStorageInfo();
        console.log("Price/TiB/month:", storageInfo.pricing.noCDN.perTiBPerMonth);
        console.log("Providers:", storageInfo.providers.length);
        console.log("Network:", storageInfo.serviceParameters.network);

        // const providerInfo = await synapse.getProvider("0x...");
        // console.log("PDP URL:", providerInfo.products.PDP!.data.serviceURL);


        return NextResponse.json({
            success: true,
            cid: ipfsCidStr,
            pieceCid: pieceCidStr,
            size: fileData.length,
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}