# Full-Stack Restaurant Application

## Overview
This project is a full-stack restaurant application developed utilizing Next.js for the frontend and Strapi v4 for the backend with GraphQL, this application demonstrates modern web application development techniques. It's a comprehensive example of a full-stack JavaScript application.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

  
## Architecture
The application is meticulously structured into two core components:
- **Frontend**: Housed within the `frontend` directory, this segment is engineered with Next.js. It serves as the interactive face of the application, offering a seamless and responsive user experience.
- **Backend**: Residing in the `backend` directory and powered by Strapi v4, this segment is the backbone of the application. It manages crucial operations such as data storage, authentication, and the intricate server-side logic.

## Features
This application is outfitted with a variety of features designed to deliver a comprehensive and user-centric online restaurant experience:
- Elegant and responsive user interface designed for optimal user experience across various devices.
- Robust user authentication system utilizing OAuth2 with Google and GitHub integration.
- Extensive restaurant and menu item management capabilities for restaurant owners.
- Integration with Stripe for secure and efficient payment processing.
- Advanced CORS management and Nginx reverse proxy setup, ensuring top-notch security and performance.

## Technology Stack
The application leverages a blend of contemporary and proven technologies:
- **Frontend**: Next.js (React framework), React (UI library), Apollo Client (state management), TailwindCSS (styling), Stripe.js (payment processing).
- **Backend**: Strapi v4 (headless CMS), SQLite (database), GraphQL (data query language), Docker (containerization), Digital Ocean (cloud hosting).

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js version 18.0.0 or higher.
- npm or Yarn as your package manager.
- Docker, if you opt for containerized deployment.

### Installation
Follow these steps to get the application running on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/titomazzetta/FullStackRestaurantApp-Oath2
2. Install frontend dependencies:
    ```bash
    cd frontend
    npm install
3. Install backend dependencies:
    ```bash
    cd backend
    yarn install
    
### Usage
1. Install backend dependencies:
   ```bash
   cd ../backend
   yarn build
2. Install front end dependcies
   ```bash 
   cd ../frontend
   npm run build
### Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request with your suggestions.

###License
This project is licensed under the MIT License - see the LICENSE.md file for details.






    
  
  

