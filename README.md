# CBT Platform (Student Test Portal)

## Overview
The CBT (Computer-Based Test) Platform is a web-based application that allows students to take online exams in a timed and structured environment. The platform provides an intuitive and seamless experience for candidates to attempt multiple-choice, essay-based, and other types of questions while ensuring security and reliability.

## Features
- **User Authentication:** Secure login and registration for students
- **Exam Interface:** Timed exam sessions with auto-submit on timeout
- **Question Navigation:** Easy navigation between questions
- **Answer Submission:** Support for multiple-choice, essay, and file upload answers
- **Live Countdown Timer:** Displays time left for the test
- **Instant Feedback:** Optional results display upon completion
- **Secure Exam Monitoring:** Prevents multiple logins and browser switching detection
- **Result Tracking:** Students can view their exam scores (if enabled)

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- npm or yarn
- PostgreSQL (if using a database backend)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/cbt-platform.git
   cd cbt-platform
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm start  # or yarn start
   ```

## Deployment
### Docker
1. Build and run the container:
   ```sh
   docker-compose up --build
   ```

### Vercel/Netlify
1. Deploy using Vercel:
   ```sh
   vercel deploy
   ```
2. Deploy using Netlify:
   ```sh
   netlify deploy
   ```

## Environment Variables
Create a `.env` file and configure the following:
```
REACT_APP_API_BASE_URL=https://api.cbt-platform.com
REACT_APP_SOCKET_URL=wss://api.cbt-platform.com/socket
REACT_APP_EXAM_DURATION=60 # Default exam duration in minutes
```

## API Endpoints
### Authentication
- `POST /api/v1/login` - Student login
- `POST /api/v1/register` - Student registration

### Exams
- `GET /api/v1/exams` - Retrieve available exams
- `POST /api/v1/exams/:id/start` - Begin an exam session
- `POST /api/v1/exams/:id/submit` - Submit answers for an exam

### Results
- `GET /api/v1/results` - View past results
- `GET /api/v1/results/:exam_id` - View result for a specific exam

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

## License
This project is licensed under the MIT License.

