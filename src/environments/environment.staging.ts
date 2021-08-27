export const environment = {
  name: 'candidate-staging',
  production: true,
  // firebaseConfig: {
  //   apiKey: "AIzaSyD_UW-b08sIHgMrsKlMOP0vmauQlRYdo14",
  //   authDomain: "hellotemp-staging.firebaseapp.com",
  //   databaseURL: "https://hellotemp-staging.firebaseio.com",
  //   projectId: "hellotemp-staging",
  //   storageBucket: "hellotemp-staging.appspot.com",
  //   messagingSenderId: "688506656860",
  //   appId: "1:688506656860:web:e4d2e11936855e36192e99",
  // },
  apiUrl: 'https://hellotemp-staging.appspot.com/api',
  // apiUrl: 'http://localhost:3333/api',
  auth0: {
    domain: 'dev-91612081.us.auth0.com',
    client_id: 'Z5HVeRbW6rue8ePjBVbp851wi9YeXa7N',
    redirect_uri: `${window.location.origin}`,
    audience: 'http://localhost:3000',
  },
};
