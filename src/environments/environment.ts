// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'candidate-dev',
  production: false,
  // apiUrl: 'http://localhost:3333/api',
  apiUrl: 'https://hellotemp-dev.appspot.com/api',
  // firebaseConfig: {
  //   apiKey: 'AIzaSyBBOYRHXJ5oGOyFGOy9ep8bJi1Yyrx9zXk',
  //   authDomain: 'hellotemp-dev.firebaseapp.com',
  //   databaseURL: 'https://hellotemp-dev.firebaseio.com',
  //   projectId: 'hellotemp-dev',
  //   storageBucket: 'hellotemp-dev.appspot.com',
  //   messagingSenderId: '1081309184329',
  //   appId: '1:1081309184329:web:0e7c26feb28d91fc4e5a98',
  // },
  // prod firebase config
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
  auth0: {
    domain: 'dev-91612081.us.auth0.com',
    client_id: 'Z5HVeRbW6rue8ePjBVbp851wi9YeXa7N',
    redirect_uri: `${window.location.origin}/session`,
    audience: 'http://localhost:3000',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
