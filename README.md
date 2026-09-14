This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Gemini recommendations

The official Gemini SDK is already installed. For a fresh checkout, install it with:

```bash
npm install @google/genai
```

Create a `.env.local` file with a Gemini API key before running the recommendation flow:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

`GOOGLE_API_KEY` is also accepted as a compatibility fallback. The API route only
returns projects from its local catalog, validates Gemini's JSON response, and
uses deterministic profile-based matches when Gemini is unavailable or returns
invalid data.

For other server-side prompts, import the reusable text service:

```ts
import { generateGeminiText } from "@/app/lib/gemini";

const answer = await generateGeminiText("Explain photosynthesis in one sentence.");
```

Keep Gemini calls in server code such as Route Handlers or Server Actions so the
API key is never exposed to the browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
