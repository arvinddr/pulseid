# Pulseid
Cash Back API development

# Initial Setup 
Run the command `docker-compose up --build` to build and start the cashback application.
Run the command `docker-compose down` to stop the cashback application.
Run the command `docker volume prune` to clear the datbase data.

# Application Access
Cashback application is available at `http://localhost:4001/`.
The swagger documentation of application is available at `http://localhost:4001/swagger-doc`.
The Mongo database could be accessed at `http://localhost:8081/`
Run the command `npm install` and `npm test` to run unit test cases for the application

# Deployment.
1) Since application is dockerized it could run on any PAAS service of cloud. For example, Azure app service container.
2) Since Mongo database has been used by application to persist the data. For example, use Azure Cosmos database with Mongo client.
3) The build and release process could be automated using Azure DevOPs CI/CD or github actions.
4) The API Authentication and Authorization could be implemented using third party identity providers like Janrain or Microsoft AAD 
 