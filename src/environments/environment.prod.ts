export const environment = {
  name: 'candidate-prod',
  production: true,
  // firebaseConfig: {
  //   apiKey: "AIzaSyCoNcteZptgXKgZpMrp4xe43KxEj0tFaCg",
  //   authDomain: "hellotemp-production.firebaseapp.com",
  //   databaseURL: "https://hellotemp-production.firebaseio.com",
  //   projectId: "hellotemp-production",
  //   storageBucket: "hellotemp-production.appspot.com",
  //   messagingSenderId: "147490195032",
  //   appId: "1:147490195032:web:3d19c2787018d8525eac2d",
  //   measurementId: "G-FM4DYH2GLK",
  // },
  apiUrl: 'https://hellotemp-production.appspot.com/api',
  // apiUrl: 'http://localhost:3333/api',
  auth0: {
    domain: 'hellotemp.us.auth0.com',
    client_id: 'OLIYFTZtSQu3FzggWHoP5F1bS9YRoDsv',
    redirect_uri: `${window.location.origin}/session`,
    audience: 'https://www.hellotemp.com',
  },
};
