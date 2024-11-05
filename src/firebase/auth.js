
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}


export const doSignOut =() => {
    return auth.signOut();
}

// export const doPasswordReset = (email) => {
//     return auth.sendPasswordResetEmail(email);
// }

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password)
// }

// export const doEmailVarification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`
//     })
// }