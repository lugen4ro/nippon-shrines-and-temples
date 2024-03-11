# About

This is a Next.js project for exploring Japanes Shrines and Temples on a simple and clearn map.

A working website can be found <a href="https://nipponshrines.com/" target="_blank">HERE</a>.

It uses the following tools / services.

-   Next.js
-   Typescript
-   Tailwind CSS
-   Radix UI
-   Leaflet - For the map
-   Prisma - ORM to interact with the MySQL database.
-   Aiven - For hosting the the MySQL database.
-   Vercel - For hosting the Next.js server.
-   Cloudinary - For storing image assets
-   Sentry - For monitoring and logging.

There is a cli-tool for deleting / uploading places (shrines and temples).
Explanation for that can be found [HERE](cli-tool/README.md).

## Running the dev server

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
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

## Other setup

To use this project, you must setup cloudinary and a MySQL database.
Specify your environment by setting the variables in the `.env` file.
Create the `.env` by renaming `.env_example` to `.env` and the filling in the values.

.env_example

```
# This is just a placeholder file. To actually use do the following:
# For local testing: Rename this file to .env and give appropriate values to the below variables
# For deployment: Do not use this file, instead set the below variables as environmental variables when deploying.

# Database for storing information about each place
DATABASE_URL="mysql://root:exampleserver@localhost:3306/databasename" # Database URL to use. Either a local hosted one or on a platform such as Aiven

# Sentry is used for logging / monitoring
SENTRY_AUTH_TOKEN="..."
SENTRY_DSN="..."

# Cloudinary is used to store images
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
LOCAL=true # This is used to seperate dev and prod images uploaded to cloudinary. If true, images are saved in a "dev/" folder on cloudinary.

# A custom API Key that is used to do admin actions with the API such as updating / deleting places (specify in POST / DELETE request header as x-api-key to authorize)
API_KEY="..."

```

### Database - MySQL

For development, spin up a local instance of MySQL and specify the URL within `.env`
Then use prisma to initialize and migrate the tables.
Look at their documentation on how to do this.

### Image hosting - Cloudinary

Create a cloudinary project, and specify it in the `.env` file.

### Sentry

Setup sentry and set your auth token and DSN in the `.env` file.

### API key

Set a custom API key in `.env` for using admin actions such as creating / deleting places using the provided API.
Instead of directly calling the API, use the cli-tool which is explained [HERE](cli-tool/README.md).
