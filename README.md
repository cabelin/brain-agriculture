
# Brain Agriculture

## Description

This project is for a challenge application and was built with the Nest.js framework and Docker Compose was used to facilitate the configuration of the development environment, which includes a PostgreSQL database.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js (version 9.8.0 or higher)](https://nodejs.org/)

## Getting Started

1. Clone this repository to your local machine:

```bash
git clone https://github.com/cabelin/brain-agriculture.git
cd brain-agriculture
```

2. Start docker-compose
```bash
docker-compose up
```

3. In another terminal (same diretory)
```bash
npm run migration:run
```



After completing the setup process, the application becomes accessible via a web browser at http://localhost:3000.

You can also access examples of endpoints in the ".rest" file, later they will be documented using swagger

