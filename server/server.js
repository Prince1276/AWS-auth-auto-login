const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3001;

// AWS Cognito configuration
const CognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

app.use(bodyParser.json());

// Middleware to check authentication status
const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const params = {
    AccessToken: authorization,
  };

  try {
    // Check if the user is authenticated
    await CognitoIdentityServiceProvider.getUser(params).promise();
    next(); // Proceed to the next middleware (or route handler) if the user is authenticated
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Protected route
app.get('/protected', checkAuth, (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
