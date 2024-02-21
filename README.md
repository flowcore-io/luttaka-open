The Flowcore Open Source Conference App is an open source application to manage tickets, networking and content at conferences. You
can either use the official instance at conference.flowcore.app, or deploy your own instance:

Deploy with Vercel

# Basic features for conference participants

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
- [ ] Conference program
- Settings
- [ ] Edit participant profile
- [ ] Edit company profile

# Basic features for conference administrators

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
- [ ] Edit conference program
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
- Conference announcements
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

- [GitHub Issues](https://github.com/flowcore-io/application-conference/issues)
- [Discord](https://discord.gg/Jw4HGPaG)
- [Email](mailto:flowcore@flowcore.com)

# Prerequisites

To run the application locally, you will need to create the datacore and scenarios required for the application to work.
You can use the Flowcore CLI to create the datacore and scenarios, or you can use the Flowcore Platform to create them manually.

To create the datacores use the following commands:

```shell
npm install -g @flowcore/cli
```

then copy the `flowcore.local.example.yaml` file to `flowcore.local.yaml` and fill in the missing information. Then you
can run the following command to spin up an environment for development:

```shell
yarn flowcore:dev
```

this will create the required resources in the Flowcore Platform, inside your tenant.

> Requires the Flowcore CLI version 2.4.0 or higher.
> Production can be created with `yarn flowcore:prod`
> The command that is run under the hood for dev is `flowcore create -f flowcore.yaml -f flowcore.local.yaml`

# Tenants

Your tenant is part of the url when you go to your organization in the Flowcore Platform. For example, if you go to `https://flowcore.io/flowcore`, then `flowcore` is your tenant.
You can also see the tenant where you select between your active organizations in the top left corner of the UI.

# Run locally

1. Clone the repository (or fork it if you intend to contribute)
2. npm install
3. Start a PostgreSQL server. You can run `npm run docker:db`
4. Copy the file `.env.example` as `.env` and fill in the missing information
5. npm run dev

# Run in a container

1. Run npm run build-image to build the docker image from the Dockerfile
2. Copy the file `.env.example` as `.container.env` and adjust the values to match the container environment
3. Run npm run `docker:app` to start the postgres and the app containers
4. You can access the app by browsing to http://localhost:3000

# License

The license is MIT. [You can read more about it here](./LICENSE)
