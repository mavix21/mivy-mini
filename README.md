# Mivy

> Farcaster-native creator monetization miniapp that stores premium posts on Filecoin, settles fan payments on Celo, and ships as a mobile-first Next.js 16 experience.

Mivy Mini pairs the Farcaster social graph with programmable cash flows so creators can publish long-form drops, gate experiences, and get paid instantly inside a miniapp-friendly UI. The `apps/web` workspace houses a Next.js 16 App Router client with Tailwind styling, shadcn/ui components, and Convex as the realtime data plane. The `apps/contracts` package delivers the solidity rails that keep every contribution transparent on Celo.

## 🧭 Overview

- Fans discover Farcaster-native creators in `apps/web/src/app/(tabs)/(home)/page.tsx`, back them with on-chain tips, and unlock member-only posts rendered via `@/components/ContentCard` and rich creator profile surfaces.
- Creators write in markdown, push to Filecoin through the Synapse SDK (see `apps/web/src/app/filecoin/page.tsx` and `apps/web/src/app/api/upload/route.ts`), and reference those decentralized assets inside posts stored in Convex tables.
- Better Auth + Sign-In-With-Farcaster (`apps/web/convex/auth.ts`) plus `@farcaster/miniapp-sdk` context providers keep authentication seamless inside Warpcast MiniApps and embedded clients.
- A Pay-Per-Content contract (`apps/contracts/contracts/PayPerContent.sol`) tracks every USDC payment, platform fee, and withdrawal so payouts can route through the Celo network the moment creators are ready to collect.

## 🧩 Platform Capabilities

- **Farcaster onboarding** — `apps/web/src/contexts/miniapp-context.tsx` wires the Farcaster miniapp core SDK, while `apps/web/src/hooks/use-sign-in-with-farcaster.ts` handles SIWF token exchange so users authenticate without leaving the MiniApp.
- **Realtime creator feed** — Convex queries/mutations in `apps/web/convex/posts.ts` keep the home feed live-updating, and the `CategoryFilter` + `SearchBar` components let fans slice content by niche or intent.
- **Decentralized storage** — The Filecoin publishing flow (`apps/web/src/app/filecoin/page.tsx`) uploads markdown + media with Synapse, returns CIDs, and hydrates the post body with `ipfs://` assets for deterministic rendering.
- **Miniapp-native UX** — Mobile-focused navigation (`apps/web/src/components/bottom-nav.tsx`) plus contextual dialogs (`auth-gate-dialog.tsx`, `MobileSettingsSheet.tsx`) keep the experience compliant with Warpcast’s miniapp guidelines laid out in `FARCASTER_SETUP.md`.
- **Notifications & wallets** — `apps/web/src/lib/notification-client.ts` and `contexts/frame-wallet-context.tsx` use `@farcaster/miniapp-wagmi-connector` so we can request wallet actions, send miniapp pings, and track supporter state directly from the client.

## 🔍 Code Deep Dive

### 🔐 MiniApp authentication & session state

`apps/web/src/contexts/miniapp-context.tsx` bootstraps the Farcaster MiniApp runtime, exposes `useFarcaster`, and coordinates with `apps/web/src/contexts/frame-wallet-context.tsx` so Wagmi is aware of the in-MiniApp signer. The `useSignInWithFarcaster` hook (`apps/web/src/hooks/use-sign-in-with-farcaster.ts`) checks `miniappSdk.isInMiniApp()`, pulls a QuickAuth token, and calls `authClient.signInWithFarcaster` (`apps/web/src/lib/auth-client.ts`) so Better Auth and Convex share the same cookie-backed session. Whenever a viewer hits a gated surface, `AuthGateDialogProvider` + `AuthGateDialog` render `SiwfButton`, which reuses that hook and surfaces loading or error states without leaking implementation details into the presentation layer.

### 🧱 Creator content lifecycle

The `PostCreationLayout` component (`apps/web/src/components/post-creation-layout.tsx`) manages the editor UI, ensures the user is signed in via `useConvexAuth`, and persists posts by calling `api.posts.create`. That mutation is defined in `apps/web/convex/posts.ts`, which validates the creator via the `creators` table and inserts a record into `posts`. Table definitions live in `apps/web/convex/tables` (for example `tables/post.ts` describes the discriminated union for text/image/video bodies and membership gating), and `apps/web/convex/schema.ts` stitches everything into Convex. On the read path, `apps/web/src/app/(tabs)/(home)/page.tsx` queries `api.posts.get`, hydrates creator + user metadata, and hands everything to `ContentCard`, `CategoryFilter`, and search logic so the feed feels native inside the MiniApp.

### 🗃️ Filecoin publishing & CID hydration

`apps/web/src/app/filecoin/page.tsx` offers a markdown-first publishing workflow that creators can hit before minting a Convex post. It calls `/api/upload`, whose handler (`apps/web/src/app/api/upload/route.ts`) initializes the Synapse SDK with the configured RPC endpoints, uploads the markdown blob, and returns an IPFS CID. Those CIDs become the `filecoinCid` fields stored in the Convex `posts` table so the feed can display signed images or videos while still pointing back to canonical decentralized storage.

### 💼 Wallet connectivity & Celo settlement

`apps/web/src/components/connect-button.tsx` and `apps/web/src/contexts/frame-wallet-context.tsx` register the Farcaster MiniApp wallet connector with Wagmi, which lets the MiniApp request a signer scoped to the host client. Once connected, the UI can call into the `PayPerContent` escrow contract (`apps/contracts/contracts/PayPerContent.sol`). The contract pairs `registerPost` (link on-chain identifiers to Convex posts), `recordPayment` (owner-only mutation that the backend loads when USDC hits the escrow), and `withdraw` (creator-triggered payout that enforces the platform fee tracked by `platformFeePercentage`). Hardhat (`apps/contracts/hardhat.config.ts`) exposes Celo, Alfajores, and Celo Sepolia networks so shipping the contract or verifying it on Celoscan is a one-command step from the monorepo root, which is why the repository-level scripts delegate to those targets.

### 📣 Notifications & engagement loops

The MiniApp keeps a rolling map of notification tokens via `apps/web/src/lib/memory-store.ts`, and `apps/web/src/lib/notification-client.ts` merges that data with tokens the Farcaster client shares during QuickAuth. From there, `sendFrameNotification` (scheduled to be renamed to reflect MiniApps) posts fan updates to the host notification endpoint, while `apps/web/src/neynar.ts` can fall back to Neynar’s publish APIs for broadcast-style pings. This keeps collectors inside the MiniApp informed whenever their favorite creator drops something new without running a separate notification service.

## 💸 Celo Integration

Mivy Mini integrates Celo to handle the trustless payment leg of the product. We ship and operate a dedicated `PayPerContent` escrow contract (see `apps/contracts/contracts/PayPerContent.sol`) that accepts USDC from supporters, records post/creator level earnings, and enforces configurable platform fees before payouts. Hardhat (`apps/contracts/hardhat.config.ts`) is prewired with Forno RPC endpoints for mainnet, Alfajores, and Celo Sepolia plus Celoscan verification targets, so deploying or verifying the rails is as simple as running `pnpm contracts:deploy:alfajores` or `pnpm contracts:deploy:celo` from the monorepo root. On the frontend, `viem`, `wagmi`, and the Farcaster miniapp wallet connector establish a signer scoped to the miniapp so we can surface “support” actions, relay payment receipts into Convex, and eventually trigger contract interactions without forcing users to leave the miniapp shell.

**In short:** Celo gives us low-cost, planet-scale settlement, Hardhat keeps those deployments reproducible, and the MiniApp client stitches the on-chain events back into the social UX so creators see their balances update in real time.

## 🏛️ Architecture Highlights

- `apps/web` — Next.js 16 application with App Router, shadcn/ui design system, Tailwind, Convex client, and Farcaster miniapp scaffolding.
- `apps/contracts` — Hardhat workspace containing solidity sources (`contracts/`), Ignition deployment modules, and Celoscan verification plumbing.
- `convex/` — Shared Convex backend logic (auth adapters, Neynar helpers, schema definitions) that persists creators, posts, memberships, and supporter stats.
- `FARCASTER_SETUP.md` — Step-by-step manifest + account association guide to keep the miniapp verified inside Warpcast and other Farcaster clients.

## 👥 Team

The project is led by Marcelo Vizcarra, a builder focused on Farcaster-native consumer crypto. Reach out on Warpcast `@mavix21` or GitHub `@mavix21` if you want to collaborate or review the roadmap.

## ⚙️ Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

This is a monorepo managed by Turborepo with the following structure:

- `apps/web` - Next.js application with embedded UI components and utilities
- `apps/hardhat` - Smart contract development environment

## 💻 Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm type-check` - Run TypeScript type checking

### 🧪 Smart Contract Scripts

- `pnpm contracts:compile` - Compile smart contracts
- `pnpm contracts:test` - Run smart contract tests
- `pnpm contracts:deploy` - Deploy contracts to local network
- `pnpm contracts:deploy:alfajores` - Deploy to Celo Alfajores testnet
- `pnpm contracts:deploy:sepolia` - Deploy to Celo Sepolia testnet
- `pnpm contracts:deploy:celo` - Deploy to Celo mainnet

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Smart Contracts**: Hardhat with Viem
- **Monorepo**: Turborepo
- **Package Manager**: PNPM

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Celo Documentation](https://docs.celo.org/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
