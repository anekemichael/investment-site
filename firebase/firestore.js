const { getFirestore } = require('firebase/firestore')
const db = getFirestore()
const { collection, doc, addDoc, setDoc, updateDoc, getDoc, getDocs, onSnapshot } = require('firebase/firestore')
var httpMsgs = require('http-msgs')


function getUid(){

}

async function addUserToFireStore(uid, data){
   return await setDoc(doc(db, 'users', uid), data)
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

async function getUserInvesmentPlan(uid, req, res){
    var docRef = doc(db, 'users', uid)
    return await getDoc(docRef).then((ref) => {
             if(ref.exists()){
                 if(ref.data().investmentId != ""){
                    getInvestmentPlan(ref.data().investmentId).then((data) => {
                        if(data.exists()){
                            httpMsgs.sendJSON(req, res, data.data())
                        }
                     })
                 } else {
                    httpMsgs.send500(req, res, "User Don't have investment Plan")
                 }
             }
         })
}

function deleteUserFromFireStore(uid){

}

async function createInvestmentPlan(uid, investmentId, data){
    var docRef = doc(db, 'users', uid)
    return await setDoc(doc(db, 'investment', investmentId), data).then((ref) => {
        updateDoc(docRef, {
        investmentId: investmentId
       })
    })
}

async function updateInvestmentPaln(uid, investmentProof){
    var docRef = doc(db, 'users', uid)
    getDoc(docRef).then(async (ref) => {
      if(ref.exists()){
        var docRef = doc(db, 'investment', ref.data().investmentId)
        return await updateDoc(docRef, {investmentProof: investmentProof})
      }
    })
}

async function getInvestmentPlan(investmentId){
    // onSnapshot(doc(db, 'investment', uid), (document) => {
    //     httpMsgs.sendJSON(req, res, document.data())
    // })
    var docRef = doc(db, 'investment', investmentId)
    return await getDoc(docRef)
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
    getUserFromFireStore: getUserFromFireStore,
    deleteUserFromFireStore: deleteUserFromFireStore,
    createInvestmentPlan: createInvestmentPlan,
    getInvestmentPlan: getInvestmentPlan,
    getUserInvesmentPlan: getUserInvesmentPlan,
    createRecentInvestmentCollection: createRecentInvestmentCollection,
    getRecentInvestments: getRecentInvestments,
    updateInvestmentPaln: updateInvestmentPaln
}