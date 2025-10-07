# Nexus LMS

A modern full-stack Learning Management System that bridges the gap between educators and students with intelligent features, seamless classroom management, and an engaging learning experience.

<img width="1913" height="952" alt="Screenshot 2025-10-05 111415" src="https://github.com/user-attachments/assets/8bd74686-e204-4d05-8a29-b28c1adac297" />


## Overview

Nexus LMS is a comprehensive platform designed for both teachers and students, offering powerful tools for classroom creation, assignment management, performance tracking, and secure communication. With AI-powered features and an interactive UI, Nexus LMS transforms traditional learning into an engaging digital experience.

<img width="1909" height="911" alt="image" src="https://github.com/user-attachments/assets/4ef7b29e-2108-418a-83c1-33fc93e970d9" />


## Key Features

### 🔐 Role-Based Authentication
- Separate portals for teachers and students with tailored experiences
- Secure email OTP verification for teachers powered by Clerk
- Protected routes and role-specific access control

### 📚 Classroom Management
- Create and manage multiple virtual classrooms
- Invite-code based student enrollment system

### 🎨 Interactive & Animated UI
- Smooth animations and transitions for enhanced user experience
- Engaging visual feedback for all interactions

### 📱 Responsive Design
- Fully optimized for desktop, tablet, and mobile devices
- Seamless experience across all screen sizes
- Touch-friendly interface for mobile users


## For Teachers

### Assignment Creation & Management
- **MCQ-Based Assignments:** Create multiple-choice quizzes with AI-powered question generation
- **PDF-Based Assignments:** Upload and assign document-based tasks
- **Submission Tracking:** View all student submissions in one place
- **Grading System:** Mark on the submitted assignments efficiently

### Content Distribution
- **Class Notes:** Upload and share study materials with students
- **Class Notices:** Post important announcements and updates
- **Free Materials:** Create promotional content to attract potential students

### Student Management
- **Invite Code System:** Generate unique codes for controlled classroom access
- **Student Roster:** Manage enrolled students and track their progress

## For Students

### Learning Experience
- **Easy Enrollment:** Join classes using invite codes.
- **Assignment Submission:** Submit MCQ and PDF-based assignments seamlessly
- **Performance Dashboard:** Track grades, completed assignments, and overall progress
- **Resource Access:** Download notes and study materials shared by teachers

<img width="1915" height="910" alt="image" src="https://github.com/user-attachments/assets/434ad33c-e0eb-4497-ba6d-5196d282f7e3" />


## Technology Stack

### Frontend
- **Next.js** - React framework for server-side rendering and optimal performance
- **Tailwind CSS** - Utility-first CSS framework for custom, responsive designs
- **Framer Motion** - Animation library for smooth, interactive UI elements

### Backend & Database
- **NeonDB** - Serverless PostgreSQL for scalable data management
- **Prisma ORM** - Type-safe database queries and schema management

### Authentication & Security
- **Clerk** - Complete user management with role-based access
- **Nodemailer Email OTP** - Secure verification for enhanced platform security

### AI Integration
- Gemini(free models)

## Live Demo

Experience Nexus LMS in action: [Nexus LMS](https://smart-classroom-seven.vercel.app/)

## Local Setup

To run Nexus LMS locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SayanDas07/Nexus-LMS.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Nexus-LMS
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add this variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   ADMIN_EMAIL=
   ADMIN_EMAIL_PASSWORD=
   DATABASE_URL=
   GEMINI_API_KEY=

   ```

5. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser and visit** `http://localhost:3000`


## Core Features Breakdown

### Assignment System
- **MCQ Assignments:** Multiple-choice questions with automatic grading
- **AI Question Generation:** Leverage AI to create diverse question sets
- **PDF Assignments:** Upload custom assignment documents
- **Submission Portal:** Centralized location for all student submissions
- **Grading Interface:** Efficient marking system with feedback options

### Classroom Features
- **Invite Code Generation:** Secure, unique codes for each classroom
- **Student Enrollment:** Manage who can access your classroom
- **Notice Board:** Post updates, deadlines, and important information
- **Resource Library:** Centralized storage for notes and materials
- **Free Materials Section:** Promote your classes with publicly accessible content

### Performance Tracking
- **Student Analytics:** View individual performance metrics
- **Assignment Statistics:** Track completion rates and average scores
- **Progress Timeline:** Visualize student improvement over time
- **Grade Book:** Comprehensive record of all grades and feedback

## Database Schema

The platform uses a robust relational database structure:
<img width="1664" height="3708" alt="image" src="https://github.com/user-attachments/assets/5d082967-c36c-4972-8cc2-0c0639cf11f3" />


## Security Features

- Role-based access control (RBAC) for teachers and students
- Email OTP verification for account security
- Invite-code protected classroom enrollment
- Secure session management via Clerk
- Protected API routes with authentication middleware
- Data encryption in transit and at rest

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


