# Forex Trading System API

This project is a backend system built using Nest.js to provide various functionalities related to foreign exchange (FX) trading. It utilizes the Alpha Vantage API to fetch live FX conversion rates and stores them for future reference.

## Setup Instructions

1. **Clone the Repository**: 
https://github.com/Deepak-Meena-github/forex-trading-system
2. **Install Dependencies**: 
cd forex-trading-system
npm install
 3. **Set Environment Variables**:
ALPHA_VANTAGE_API_KEY=<your-alpha-vantage-api-key>

4. **Run the Application**: 

5. **Access API Documentation**:
Once the application is running, you can access the Swagger API documentation at:
http://localhost:3000/api

## API Endpoints

The API provides the following endpoints:

- **GET /fx-rates**: Fetches the latest exchange rates for supported currency pairs.
- **POST /top-up/:userId**: Tops up the account balance for a specific user.
- **GET /balance/:userId**: Retrieves the account balance for a specific user.
- **POST /fx-conversion**: Performs an FX conversion for a specific user.

For detailed information on request and response formats, please refer to the Swagger documentation.

## Error Handling and Validation

The application ensures proper error handling and validation for API inputs. Invalid requests will receive appropriate error responses with descriptive messages.

## Testing

Unit tests have been implemented to ensure the reliability of the application. You can run the tests using:
