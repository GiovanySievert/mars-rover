# Mars Rover Project


### Prerequisites
 - **Docker**
 - **Docker compose**

### How to run
  1- docker-compose up

  2 - Access the application at http://localhost:3001 for the backend and http://localhost:8080 for the frontend.


### Importante note:
  If you're running the project in an environment that is **not M2(Apple Silicon)**  make sure to comment out the following line in prisma/schema.prisma:

  ``binaryTargets = ["native", "linux-arm64-openssl-3.0.x", "linux-musl-arm64-openssl-3.0.x"]``
