const { app } = require("firebase-admin");
var admin = require("firebase-admin");

var serviceAccount = require("./firebase.key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getUserWithEmail(email){
    admin.auth()
    .getUserByEmail(email)
    .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    return userRecord.toJSON();
    })
    .then(user=>{
        console.log(user);
        return user;
    })
    .catch((error) => {
    console.log('Error fetching user data:', error);
    });
}

getUserWithEmail('user@user.user')

/* admin.auth().createUser({
    email: 'user@example.com',
    emailVerified: false,
    phoneNumber: '+11234567890',
    password: 'secretPassword',
    displayName: 'John Doe',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  }); */




/* admin.auth().createCustomToken(userId)
  .then((customToken) => {
    console.log(customToken);
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  }); */




/* admin.auth().verifyIdToken(idToken)
.then((decodedToken) => {
  const uid = decodedToken.uid;
  console.log(uid);
})
.catch((error) => {
  // Handle error
  console.log(error);
});
 */

