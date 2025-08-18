# Full-Stack Application with NestJS

This project is a full-stack application with a NestJS backend, managed as an Nx workspace.

## Prerequisites

- Node.js (v18 or higher recommended)
- AWS CLI configured with credentials
- AWS CDK (Cloud Development Kit)

## Getting Started

### 1. Install Dependencies

Clone the repository and install the required packages:

```bash
git clone <repository-url>
cd <repository-name>
npm install
```

### 3. Running the Backend Server

To start the NestJS backend server for local development, run:

```bash
npx nx serve server
```

The server will start on the port defined in your configuration (by default `3000`).
The Docs can be accessed at http://{host}:{port}/api/docs

## Deployment

This application is configured for deployment to AWS using the AWS CDK.

### Prerequisites

- An AWS Account with credentials configured on your machine.
- The AWS CDK must be installed and bootstrapped for your AWS account and target region.

### Deploying the Application

To deploy the infrastructure and the application to AWS, execute the following command:

```bash
npx nx deploy
```

This command will synthesize the AWS CloudFormation templates and deploy the stacks to your AWS account. Ensure your AWS user has sufficient permissions.
