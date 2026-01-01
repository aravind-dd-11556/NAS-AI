This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started testing

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

## Deploy on Zoho Catalyst

To deploy this Next.js application on [Zoho Catalyst](https://catalyst.zoho.com/), follow these steps:

1.  **Install Catalyst CLI**:
    ```bash
    npm install -g zcatalyst-cli
    ```

2.  **Login to Catalyst**:
    ```bash
    catalyst login
    ```

3.  **Initialize Project**:
    Run the following command in your project root:
    ```bash
    catalyst init
    ```
    -   Select your project.
    -   Choose **App Sail** (for hosting Next.js as a server-side app) or **Web Client** (for static export). *Recommended: App Sail for full Next.js features.*

4.  **Deploy**:
    ```bash
    catalyst deploy
    ```

For detailed instructions, refer to the [Catalyst Documentation](https://docs.catalyst.zoho.com/).

## Deploy via Catalyst Slate (Git Integration)

**Catalyst Slate** allows you to deploy your application directly from your GitHub repository with automatic updates on every push.

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Open Catalyst Console**: Go to the [Zoho Catalyst Console](https://console.catalyst.zoho.com/).
3.  **Navigate to Slate**: In your project, select **Slate** from the left sidebar.
4.  **Create App**: Click **Create New App**.
5.  **Connect GitHub**: Select **GitHub** as your source and authorize Zoho Catalyst.
6.  **Select Repository**: Choose the `NoAsAService` repository.
7.  **Configure Build**:
    -   **Framework**: Next.js
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `.next` (or `out` if using static export)
8.  **Deploy**: Click **Deploy**. Your app will be live and will auto-deploy on future commits.
