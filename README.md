# Ploshadka WEB
Api part of the sports leisure organization service

**Ploshadka API** is a backend service created for studying purposes as part of a sports leisure organization service.

## Requirements

- Node.js
- Yarn (dependency manager)
- Google API credentials
- Docker

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/e11sy/ploshadka.api.git
   cd ploshadka.api
   ```
2. Configure the environment variables:
   - Copy the `app-config.yaml` file to `app-config.local.yaml`:
     ```bash
     cp app-config.yaml app-config.local.yaml
     ```
   - Update the `.app.config.local` file with your google api credentials.
3. Start the development server:
   - Run server postgres and api docker containers. 
   ```bash
   docker-compose up -d 
   ```

## Note

This project is for **learning purposes only** and is not intended for production use.
If you are interested in the development of the project or facing bugs - leave an issue or write [me](https://t.me/e11sy)
