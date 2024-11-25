# Borderless Passport Uploader

## Overview

**Borderless Passport Uploader** is a utility designed to extract the date of birth and expiration date from identity documents.

**Deployed Version:** [Access the live app here](https://d24brwv6tluxnb.cloudfront.net)

You can use demo images that the application was tested with [in this folder](example-images)

---

## Tech Stack

This project leverages the power of **[SST](https://sst.dev/)** for seamless development and deployment of AWS-based applications. SST allows local debugging while connected to real AWS resources and integrates with infrastructure defined using **[Pulumi](https://www.pulumi.com/)**.

### Repository Structure

The repository is a **monorepo** containing three main packages:

1. **`lambdas`**: AWS Lambda functions for backend logic.
2. **`web`**: A Next.js frontend application, deployed using **[OpenNext](https://github.com/opennextjs/opennextjs-aws)**.
3. **`libs`**: Shared code usable by both client and server.

Additionally:

- **`/infra`**: Contains AWS resource definitions written with **Pulumi**.

### Database

The project uses **[NeonDB](https://console.neon.tech/)** for PostgreSQL due to its simplicity, developer-friendly experience, and low operational overhead. Recent updates in **[Aurora Serverless v2](https://aws.amazon.com/blogs/database/introducing-scaling-to-0-capacity-with-amazon-aurora-serverless-v2/)** may lead to future adjustments.

### Key Technologies

- **[Drizzle](https://orm.drizzle.team/)** + **Drizzle-kit**: ORM for PostgreSQL.
- **[TailwindCSS](https://tailwindcss.com/)**: For styling.
- **[React Query](https://tanstack.com/query/latest)**: Simplified React state management.
- **[zod](https://zod.dev/)**: Proper type checking.

---

## System Architecture

### Component Flow

<img width="817" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/c146d1c6-2fc0-46b5-b999-131cbf6c04ef">

#### Step-by-Step Process:

1. **Image Upload**:
   - User uploads an image of a document via the web interface.
2. **Get Pre-Signed URL**:
   - Frontend calls the `generate-passport-upload-url` Lambda to obtain a pre-signed URL for S3.
3. **Direct S3 Upload**:
   - Frontend uploads the image to S3 using the pre-signed URL.
4. **Process Upload**:
   - The `process-passport-image` Lambda triggers upon file upload, creating an initial database entry (`UPLOADED` state).
   - The same Lambda uses AWS Textract to extract relevant information from the uploaded document.
5. **State Update**:
   - The `process-passport-image` Lambda updates the database with a `PROCESSED` or `ERROR` state based on Textract results.
6. **Polling**:
   - The frontend periodically calls the `get-passport-info` Lambda to check the document's processing status until a terminal state is reached.

#### Noteworthy Points:

- There is a brief moment when an uploaded document exists in S3 but is not yet recorded in the database.
- AWS services used include:
  - **AWS Secrets Manager**: Secure storage for sensitive information like DB connection strings.
  - **AWS API Gateway**: For routing API requests.
  - **AWS IoT WebSockets**: For local development with SST.
  - **AWS infrastructure** utilized by **OpenNext** (e.g., DynamoDB, SQS, Lambda functions).

---

## Development Guide

### Prerequisites

1. Install **pnpm**.
2. Use **Node.js v20.12.2** (recommended to manage versions via `nvm`).
3. Configure the `borderless` AWS profile locally for correct AWS account integration.
4. Account and an empty databse created with [NeonDB](https://console.neon.tech/). Connection string will need to be placed in AWS Secrets manager, described in the instuctions below.

### Steps to Set Up Local Development

1. Clone this repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set db conncetion string as a secret in AWS account:
   ```bash
   pnpm secret:set NeonDbBorderlessPassportUploaderConnectionString --fallback
   ```
   then paste the connection string in the interactive prompt which opened. This will set the secret that will be used by all stages in this AWS account unless an override is specified. Learn more [here](https://sst.dev/docs/component/secret/).
4. Apply db migrations for first time

   - navigate to `packages/libs` folder via
     ```bash
     cd packages/libs
     ```
   - Execute db migration
     ```bash
     pnpm db:migrate
     ```
   - (Optional) To see you database locally via drizzle studio
     ```bash
     pnpm db:studio
     ```
   - (For future) When changing db schema
     - generate migration files
       ```bash
       pnpm db:generate
       ```
     - apply migrations
       ```bash
       pnpm db:migrate
       ```

5. Start the development environment:
   ```bash
   pnpm dev
   ```
   - Deploys your personal stage to AWS.
   - Runs the Next.js app locally at `localhost:3000`, connected to your API.
6. Debug Lambda functions with breakpoints by following the **[SST live debugging guide](https://sst.dev/docs/live/)**.

### Deployment

- **Production Deployment**:
  ```bash
  pnpm deploy:prod
  ```
  - Deploys the application to the `prod` stage in your AWS account.
  - You can use a separate AWS account for production.
