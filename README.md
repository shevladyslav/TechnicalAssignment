# Technical Assignment Documentation

## Installation

Clone the repository:

`git clone https://github.com/shevladyslav/TechnicalAssignment.git`

`cd TechnicalAssignment`

### Using Docker Compose

Build and run the containers:

`docker-compose up --build`

To find the container name:

`docker ps`

Example output:
`NAMES
technicalassignment-backend-1`

Access the backend container:

`docker exec -it technicalassignment-backend-1 bash`

Initialize and migrate the database:

`flask --app src db init`

`flask --app src db migrate`

`flask --app src db upgrade`

## Usage

Once the project is running, you can interact with it as follows:

### Backend

Access the Flask API:

http://localhost:5000/api/v1/books

### Frontend

Open the frontend in your browser:

http://localhost:3000
