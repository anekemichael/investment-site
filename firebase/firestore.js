const { getFirestore } = require('firebase/firestore')
const db = getFirestore()
const { doc, setDoc, onSnapshot } = require('firebase/firestore')
var httpMsgs = require('http-msgs')


function getUid(){

}

async function addUserToFireStore(uid, data){
   return await setDoc(doc(db, 'users', uid), data)
}

function updateUserToFireStore(uid){

}

async function getUserFromFireStore(uid, req, res){
   onSnapshot(doc(db, 'users', uid), (document) => {
       httpMsgs.sendJSON(req, res, document.data())
   })
}

function deleteUserFromFireStore(uid){

}

module.exports = {
    addUserToFireStore: addUserToFireStore,
    updateUserToFireStore: updateUserToFireStore,
    getUserFromFireStore: getUserFromFireStore,
    deleteUserFromFireStore: deleteUserFromFireStore
}