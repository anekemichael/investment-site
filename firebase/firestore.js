const { getFirestore } = require('firebase/firestore')
const db = getFirestore()
const { collection, doc, addDoc, setDoc, updateDoc, getDoc, getDocs, onSnapshot } = require('firebase/firestore')
var httpMsgs = require('http-msgs')


function getUid(){

}

async function addUserToFireStore(uid, data){
   return await setDoc(doc(db, 'users', uid), data)
}

function updateUserToFireStore(uid, data){

}

async function getUserDataOnce(uid, req, res){
    var docRef = doc(db, 'users', uid)
    return await getDoc(docRef).then((ref) => {
             if(ref.exists()){
                 getInvestmentPlan(ref.data().investmentId, req, res)
             }
         })
}

async function getUserFromFireStore(uid, req, res){
//    onSnapshot(doc(db, 'users', uid), (document) => {
//        httpMsgs.sendJSON(req, res, document.data())
//    })
      var docRef = doc(db, 'users', uid)
      return await getDoc(docRef).then((ref) => {
        if(ref.exists()){
            httpMsgs.sendJSON(req, res, ref.data())
        }
    })
}

function deleteUserFromFireStore(uid){

}

async function createInvestmentPlan(uid, data){
    var docRef = doc(db, 'users', uid)
    var investmentId = uid + (Math.floor(Math.random() * 100)).toString()
    return await setDoc(doc(db, 'investment', investmentId), data).then((ref) => {
        updateDoc(docRef, {
        investmentId: investmentId
       })
    })
}

async function getInvestmentPlan(uid, req, res){
    // onSnapshot(doc(db, 'investment', uid), (document) => {
    //     httpMsgs.sendJSON(req, res, document.data())
    // })
    var docRef = doc(db, 'investment', uid)
    return await getDoc(docRef).then((ref) => {
      if(ref.exists()){
          httpMsgs.sendJSON(req, res, ref.data())
      }
  })
}

async function createRecentInvestmentCollection(uid, data){
    var docRef = doc(db, 'users', uid)
    return await addDoc(collection(db, docRef.path + "/" + "recent_investment"), data);
}

async function getRecentInvestments(uid){
    var docRef = doc(db, 'users', uid)
    var investments = []
    var investmentDocRef = await getDocs(collection(db, docRef.path + "/" + "recent_investment"))
    investmentDocRef.forEach((doc) => {
        investments.push({
            data: doc.data()
        })
    })
    return investments
}

async function withdrawFunds(uid){

}

module.exports = {
    addUserToFireStore: addUserToFireStore,
    updateUserToFireStore: updateUserToFireStore,
    getUserFromFireStore: getUserFromFireStore,
    deleteUserFromFireStore: deleteUserFromFireStore,
    createInvestmentPlan: createInvestmentPlan,
    getInvestmentPlan: getInvestmentPlan,
    getUserDataOnce: getUserDataOnce,
    createRecentInvestmentCollection: createRecentInvestmentCollection,
    getRecentInvestments: getRecentInvestments
}