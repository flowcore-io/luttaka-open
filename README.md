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
- Prisma to access the database
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

# Run locally

1. Clone the repository (or fork it if you intend to contribute)
2. npm install
3. Start a PostgreSQL server. You can run ./scripts start-local-db.sh if you don’t have a server already.
4. Copy the file .env.example as .env
5. npm run dev

# Run in a container

1. Run npm run build-image to build the docker image from the Dockerfile
2. Copy the file container.env.example as container.env
3. Run npm run start-container to start the postgres and the flowcoreconference containers
4. You can access the app by browsing to http://localhost:3000

# License

The license is MIT. [You can read more about it here](./LICENSE)
