import Rebase from 're-base';
import firebase from 'firebase';
//
// const database = Rebase.createClass({
//     apiKey: "AIzaSyBQGGb2Kd_F7XIrqJDZ5LqcdAPv_rWpGWs",
//     authDomain: "prstbt-udemy-chatbox.firebaseapp.com",
//     databaseURL: "https://prstbt-udemy-chatbox.firebaseio.com"
// });
//
// export default database;



const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBQGGb2Kd_F7XIrqJDZ5LqcdAPv_rWpGWs",
    authDomain: "prstbt-udemy-chatbox.firebaseapp.com",
    databaseURL: "https://prstbt-udemy-chatbox.firebaseio.com",
});
const database = Rebase.createClass(firebaseApp.database());
export default database;