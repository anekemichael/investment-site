const { getFirestore, where } = require('firebase/firestore')
const db = getFirestore()
const { collection, doc, addDoc, setDoc, updateDoc, getDoc, getDocs, onSnapshot, query } = require('firebase/firestore')
var httpMsgs = require('http-msgs')


function getUid(){

}

async function addUserToFireStore(uid, data){
   return await setDoc(doc(db, 'users', uid), data)
}

async function updateUserBasicInfo(uid, fullName, gender, address, country, phone){
    var docRef = doc(db, 'users', uid)
    return await updateDoc(docRef, { 
       fullName: fullName,
       gender: gender,
       address: address,
       country: country,
       phone: phone
     })
}

async function updateAccountInfo(uid, bankName, accountName, accountNumber, btcWallet, ethWallet, usdtWallet) {
    var docRef = doc(db, 'users', uid)
    return await updateDoc(docRef, {
        bankName: bankName,
        accountName: accountName,
        accountNumber: accountNumber, 
        btcWallet: btcWallet,
        etherumWallet: ethWallet,
        usdt: usdtWallet
    })
}


async function updateUserPassword(uid, password) {
    var docRef = doc(db, 'users', uid)
    return await updateDoc(docRef, { password: password })
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

async function getUserData(uid) {
    var docRef = doc(db, 'users', uid)
    return await getDoc(docRef)
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
    var docRef = doc(db, 'investment', investmentId)
    return await getDoc(docRef)
}

// async function listenForInvestmentDocumentChange(res, uid) {
//     onSnapshot(doc(db, 'investment', uid), (document) => {
//        res.redirect('/dash-board')
//     })
// }

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

async function getAllActiveInvestmentPlan(){
    var activeInvestments = query(collection(db, 'investment'), where('investmentStatus', '==', true))
    return await getDocs(activeInvestments)
}

async function updateActiveInvestmentIntrest(investmentId, intrest){
    var docRef = doc(db, 'investment', investmentId)
    await updateDoc(docRef, {btcBalance: intrest})
}

// async function withdrawFunds(investmentId, ){
//    var docRef = doc(db, 'investment', investmentId)
   
// }

async function createWithdrawalCollection(uid, data){
    var docRef = doc(db, 'users', uid)
    return await addDoc(collection(db, docRef.path + "/" + "recent_withdrawal"), data);
}

async function getAllWithdrawalCollection(uid){
    var docRef = doc(db, 'users', uid)
    var withdrawals = []
    var withdrawalsDocRef = await getDocs(collection(db, docRef.path + "/" + "recent_withdrawal"))
    withdrawalsDocRef.forEach((doc) => {
        withdrawals.push({
            data: doc.data()
        })
    })
    return withdrawals
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
    updateInvestmentPaln: updateInvestmentPaln,
    getAllActiveInvestmentPlan: getAllActiveInvestmentPlan,
    updateActiveInvestmentIntrest: updateActiveInvestmentIntrest,
    createWithdrawalCollection: createWithdrawalCollection,
    getAllWithdrawalCollection: getAllWithdrawalCollection,
    updateUserBasicInfo: updateUserBasicInfo,
    updateAccountInfo: updateAccountInfo,
    updateUserPassword: updateUserPassword,
    getUserData: getUserData,
    // listenForInvestmentDocumentChange: listenForInvestmentDocumentChange
}