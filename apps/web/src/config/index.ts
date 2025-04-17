export const config = {
    firebaseAPIKey: String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    firebaseAuthDomain: String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    firebaseProjectId: String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    firebaseStorageBucket: String(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    firebaseMessagingSenderId: String(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    firebaseAppId: String(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    firebaseMeasurementId: String(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
}