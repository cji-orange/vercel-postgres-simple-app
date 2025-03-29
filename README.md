# Vercel Postgres Musical Instruments App

A simple web application to manage a database of musical instruments, built with:

*   Vanilla HTML, CSS, JavaScript
*   Vercel Serverless Functions
*   Vercel Postgres

## Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Connect to your Vercel Postgres database. You'll need to set the following environment variables in your Vercel project settings:
    *   `POSTGRES_URL`
    *   `POSTGRES_PRISMA_URL`
    *   `POSTGRES_URL_NON_POOLING`
    *   `POSTGRES_USER`
    *   `POSTGRES_HOST`
    *   `POSTGRES_PASSWORD`
    *   `POSTGRES_DATABASE`
4.  Run locally using the Vercel CLI: `vercel dev`

## Deployment

1.  Push your code to GitHub.
2.  Connect your GitHub repository to Vercel.
3.  Ensure the Vercel Postgres integration is set up for your project.
4.  Make sure the environment variables mentioned in the Setup section are configured in Vercel.
5.  Vercel will automatically deploy changes pushed to the main branch. # vercel-postgres-simple-app
