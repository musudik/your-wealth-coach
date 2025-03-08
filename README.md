# Your Wealth Coach - Admin Dashboard

This repository contains the admin dashboard for the Your Wealth Coach financial coaching platform. The dashboard allows partners to manage clients, forms, and appointments.

## Features

- **Client Management**: View and manage client information
- **Form Processing**: Review and approve client-submitted forms
- **Activity Tracking**: Monitor recent client activities
- **Performance Metrics**: Track business performance
- **Appointment Scheduling**: Manage upcoming client appointments

## Technology Stack

- React with TypeScript
- Firebase (Firestore, Authentication, Storage)
- Tailwind CSS for styling
- Vite for build and development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-wealth-coach.git
   cd your-wealth-coach
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY_FF=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN_FF=your-auth-domain
   VITE_FIREBASE_PROJECT_ID_FF=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET_FF=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID_FF=your-messaging-sender-id
   VITE_FIREBASE_APP_ID_FF=your-app-id
   VITE_FIREBASE_DATABASE_URL_FF=your-database-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Firestore Database Structure

The dashboard uses the following Firestore collections:

- **clients**: Client information and profiles
- **partners**: Partner information and profiles
- **forms**: Form submissions from clients
- **appointments**: Scheduled appointments between partners and clients
- **activities**: Recent activities performed by clients
- **metrics**: Performance metrics for partners

## Dashboard Components

- **ClientDirectory**: Displays and manages client information
- **FormCategories**: Shows form submissions by category
- **StatsOverview**: Displays key statistics
- **PerformanceMetrics**: Shows business performance metrics
- **UpcomingAppointments**: Lists upcoming client appointments
- **RecentActivity**: Shows recent client activities

## Deployment

The application is configured to be deployed on Replit. To deploy:

1. Push your changes to the repository
2. Connect your Replit account to the repository
3. Deploy using the Replit deployment options

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide Icons](https://lucide.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
