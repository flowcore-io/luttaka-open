Luttaka is an open source application to manage tickets, networking and content at events. You
can either use the official instance at luttaka.com, or deploy your own instance.

# Basic features for event participants

- Tickets
- [ ] Buy ticket with credit/debit cards
- [ ] See which tickets have been bought
- [ ] Assign tickets to others
- [ ] Show QR-code during check-in
- Networking
- [ ] Search for participants
- [ ] Mark favourites
- Content
- [ ] Search for companies
- [ ] Mark favourites
- [ ] event program
- Settings
- [ ] Edit participant profile
- [ ] Edit company profile

# Basic features for event administrators

- Tickets
- [ ] Manual registration of sold tickets
- [ ] See which tickets have been bought
- [ ] Assign tickets that have been bought
- [ ] Print participant label
- [ ] Check-in participant (scan QR-code)
- Networking
- [ ] Search for participants
- [ ] Edit participant information
- [ ] Hide participant
- Content
- [ ] Search for companies
- [ ] Edit company information
- [ ] Hide company
- [ ] Edit event program
- Settings
- [ ] Manage admin permissions
- [ ] Logs

# Potential future modules

- Personalized agenda
- Calendar integration
- Speaker profiles
- Interactive maps
- In-app messaging
- Matchmaking
- Company showcase section
- Rating system for participants to provide feedback to companies
- Voting system
- Event announcements
- Live updates
- Interactive features for participants to ask questions during sessions.
- Polls for participant engagement and feedback.
- Details about exhibitors, their products, and booth locations.
- QR code scanner for quick access to exhibitor information
- Recognition for event sponsors with logos and descriptions.
- Special sections for sponsor activities or presentations.
- Social media integration
- Document repository
- Event analytics
- Emergency information
- Crypto art wallet

# Stack

- Next.js for the web application
- TailwindCSS for the styling
- shadcn/UI for the UI components
- Drizzle to access the database
- Vercel for hosting (application and database)
- Stripe for payment processing
- Flowcore for data infrastructure

# Contribute

The project is open to contributions. Feel free to open an issue or even a pull-request!
You can [read mode about our contribution guidelines in here](./CONTRIBUTING.md).

## Contact

If you have any questions, concerns, or suggestions, please reach out to us through one of the following channels:

- [GitHub Issues](https://github.com/flowcore-io/luttaka/issues)
- [Discord](https://discord.gg/Jw4HGPaG)
- [Email](mailto:flowcore@flowcore.com)

# Prerequisites

To run the application locally, you will need to create the datacore and scenarios required for the application to work.
You can use the Flowcore CLI to create the datacore and scenarios, or you can use the Flowcore Platform to create them manually.

To create the datacores use the following commands:

```shell
npm install -g @flowcore/cli
```

# Clerk

The application uses [Clerk](https://clerk.com) for authentication. Therefor you need to create an account and create a new Clerk application, followed by [obtaining the environment credentials that connects this project to your clerk application](https://clerk.com/docs/quickstarts/nextjs#set-your-environment-variables).
You need the two environmental variables `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to be set in your `.env` file.)

Follow this [Link](https://docs.stripe.com/stripe-cli), To setup Stripe CLI on your machine. So you can easily interact with Stripe Webhooks

### Setting up Stripe Account

To setup a test stripe account without providing bank information

1. Go to [Stripe](https://stripe.com) and create an account
2. Go to [Dashboard](https://dashboard.stripe.com/test/dashboard) and click on `Developers`
3. Click on `API keys` and copy the `Secret key` and `Publishable key`
4. Create `.env` file in your root folder
5. Copy the content inside the `.env.example` and paste it inside newly created `.env` file
6. Paste the `Secret key` as `STRIPE_SECRET_KEY`
7. Paste the `Publishable Key` as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the `.env` file
8. Run `yarn stripe:listen` in your terminal and then fill the `WEBHOOK_SECRET` directly from the terminal

---

# Tenants

Your tenant is part of the url when you go to your organization in the Flowcore Platform. For example, if you go to `https://flowcore.io/flowcore`, then `flowcore` is your tenant.
You can also see the tenant where you select between your active organizations in the top left corner of the UI.

# Run the project locally

- Clone the repository
- **Scaffold the project into your flowcore account:**

To run the application locally, you will need to create the datacore and scenarios required for the application to work.
You can use the Flowcore CLI to create the datacore and scenarios, or you can use the Flowcore Platform to create them manually.

then copy the `flowcore.local.example.yaml` file to `flowcore.local.yaml` and fill in the missing information. Then you
can run the following command to spin up an environment for development:

```shell
yarn flowcore:dev
```

this will create the required resources in the Flowcore Platform, inside your tenant.

> Requires the Flowcore CLI version 2.5.0 or higher.
> Production can be created with `yarn flowcore:prod`
> The command that is run under the hood for dev is `flowcore create -f flowcore.yaml -f flowcore.local.yaml`

## Setup Stripe CLI

Follow this [Link](https://docs.stripe.com/stripe-cli), To setup Stripe CLI on your machine. So you can easily interact with Stripe Webhooks

- Copy the file `.env.example` as `.env` and fill in the missing information
- Run `yarn dev` to start the development server
- Run `yarn local:stream -s now` to start streaming data from Flowcore to your local instance
- **You can access the app by browsing to [http://localhost:3000](<[https://](http://localhost:3000)>)**

## Node Version Requirement

When running `yarn install`, you may get an error saying your Node.js version is outdated and you need to upgrade.

To run this app, you need Node.js version `20.11.0` or higher.

If you need to install a different Node.js version, you can use a version manager like [nvm](https://github.com/nvm-sh/nvm) to switch between versions easily.

---

## Setting up Stripe Account

To setup a test stripe account without providing bank information

1. Go to [Stripe](https://stripe.com) and create an account
2. Go to [Dashboard](https://dashboard.stripe.com/test/dashboard) and click on `Developers`
3. Click on `API keys` and copy the `Secret key` and `Publishable key`
4. Create `.env` file in your root folder
5. Copy the content inside the `.env.example` and paste it inside newly created `.env` file
6. Paste the `Secret key` as `STRIPE_SECRET_KEY`
7. Paste the `Publishable Key` as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the `.env` file
8. Run `yarn stripe:listen` in your terminal and then fill the `WEBHOOK_SECRET` directly from the terminal

---

# Tenants

Your tenant is part of the url when you go to your organization in the Flowcore Platform. For example, if you go to `https://flowcore.io/flowcore`, then `flowcore` is your tenant.
You can also see the tenant where you select between your active organizations in the top left corner of the UI.

# Clerk

You need to create an account with [Clerk](https://clerk.com) and create a new application. You need the two environmental variables `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to be set in your `.env` file.

# Run locally

1. Clone the repository (or fork it if you intend to contribute)
2. `yarn`
3. Start a PostgreSQL server. You can run `yarn docker:db`
4. Run `yarn db:push` to create the database tables
5. Copy the file `.env.example` as `.env` and fill in the missing information
6. `yarn dev`
7. `yarn local:stream`
8. Run `yarn stripe:listen` in your terminal to listen webhooks events
9. You can access the app by browsing to [http://localhost:3000](<[https://](http://localhost:3000)>). The first user to login gets admin privileges.

# Run in a container

1. Run `yarn build-image` to build the docker image from the Dockerfile
2. Copy the file `.env.example` as `.container.env` and adjust the values to match the container environment
3. Run `yarn docker:app` to start the postgres and the app containers
4. You can access the app by browsing to [http://localhost:3000](<[https://](http://localhost:3000)>)

> Note: The `-s now` flag is used to stream from now on. If you want to stream from a specific time, you can use the `-s 1d` flag. Consult the [flowcore docs](https://docs.flowcore.io/guides/flowcore-cli/4stream-cli/#stream-from-a-specific-time) for more information.

> Note: The `local:stream` command uses the `flowcore.local.development.yaml` file to configure what streams to start and where to send the events for each stream. You can read more about the configuration [here](https://docs.flowcore.io/guides/flowcore-cli/4stream-cli/#local-development)

# License

The license is MIT. [You can read more about it here](./LICENSE)
