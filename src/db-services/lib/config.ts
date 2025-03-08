// // Helper function to get environment variables with fallback to Replit Secrets
// const getEnvVariable = (key: string): string => {
//   // Try import.meta.env first (Vite's way of accessing env variables)
//   const envValue = import.meta.env[key];
//   if (envValue) return envValue;

//   // Fallback to Replit Secrets if env value is not found
//   // @ts-ignore - Replit specific global
//   if (typeof global.REPLIT_DB_URL !== 'undefined') {
//     // @ts-ignore - Replit specific
//     return import.meta.env[key] || '';
//   }

//   return '';
// };

// export const config = {
//   firebase: {
//     apiKey: getEnvVariable('VITE_FIREBASE_API_KEY_FF'),
//     authDomain: getEnvVariable('VITE_FIREBASE_AUTH_DOMAIN_FF'),
//     projectId: getEnvVariable('VITE_FIREBASE_PROJECT_ID_FF'),
//     storageBucket: getEnvVariable('VITE_FIREBASE_STORAGE_BUCKET_FF'),
//     messagingSenderId: getEnvVariable('VITE_FIREBASE_MESSAGING_SENDER_ID'),
//     appId: getEnvVariable('VITE_FIREBASE_APP_ID'),
//     databaseURL: getEnvVariable('VITE_FIREBASE_DATABASE_URL'),
//     measurementId: getEnvVariable('VITE_FIREBASE_MEASUREMENT_ID')
//   }
// }; 