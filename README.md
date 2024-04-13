Luttaka is an open source application to manage tickets, networking and content at events. You
can either use the official instance at luttaka.com, or deploy your own instance.

# Basic features for event participants

- Tickets
- [x] Assign tickets to others
- [x] Show QR-code during check-in
- Networking
- [x] List participants
- [ ] Search for participants
- [ ] Mark favourites
- Content
- [x] List companies
- [ ] Search for companies
- [ ] Mark favourites
- [ ] Event program
- Settings
- [x] Edit participant profile
- [x] Edit company profile

# Basic features for event administrators

- Tickets
- [x] Generate tickets
- [x] Assign tickets that have been bought
- [ ] Print participant label
- [x] Check-in participant (scan QR-code)
- Networking
- [ ] Edit participant information
- [ ] Hide participant
- Content
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
- Shadcn/UI for the UI components
- Clerk for authentication
- Drizzle to access the database
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

To run the application locally, there are a couple of things that you need to have installed:

### Node.js

In order to run the project, you will need to have [Node.js](https://nodejs.org/en) installed. We recommend installing it through [nvm](https://github.com/nvm-sh/nvm).
You will need Node.js version `20.11.0` or higher.

### yarn

We use [yarn](https://yarnpkg.com) as our package manager. You can install it by running `npm install -g yarn`.

### Docker Desktop (optional, but recommended)

We utilise docker to run the Postgres database locally. You can install Docker Desktop from [here](https://www.docker.com/products/docker-desktop).
This is not a requirement, but we recommend always running a database in a container - and as such, we assume that you have Docker installed in the instructions below.

### Flowcore Account

Because the app uses Flowcore as its backend, you will need to set up a free account at [Flowcore](https://flowcore.io). You can read up on the basics [here](https://docs.flowcore.io/guides/1-account/1create-an-account/)

### Flowcore CLI

To improve the development experience, we use the [Flowcore CLI](https://www.npmjs.com/package/@flowcore/cli). This tool is used for both scaffolding the project on your flowcore account, as well as stream the data from flowcore to your local database.
Run the following to install the flowcore cli:

```shell
npm install -g @flowcore/cli
```

# Clerk

The application uses [Clerk](https://clerk.com) for authentication. Therefor you need to create an account and create a new Clerk application, followed by [obtaining the environment credentials that connects this project to your clerk application](https://clerk.com/docs/quickstarts/nextjs#set-your-environment-variables).
You need the two environmental variables `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to be set in your `.env` file.)

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

- Run `yarn` to install the dependencies
- Start a PostgreSQL server. You can run `yarn docker:db` (_requires Docker_)
- Copy the file `.env.example` as `.env` and fill in the missing information

- **Run `yarn db:push` to create the database tables**:
  Because of how Flowcore works, we do not need to consider database migrations. The databases are purely populated from the flowcore platform, hence why we can wipe the database whenever we want to make a change with no worry.

- Run `yarn dev` to start the development server
- Run `yarn local:stream` to start streaming data from Flowcore to your local database
- **You can access the app by browsing to [http://localhost:3000](<[https://](http://localhost:3000)>)**

The first user to login gets admin privileges.

# License

The license is MIT. [You can read more about it here](./LICENSE)
