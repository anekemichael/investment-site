const cron = require('node-cron')
const db = require('../../firebase/firestore')

// cron.schedule('10 * * * *', () => {
//     //addIntrestToUser()
//     console.log("cron_job");
// })

cron.schedule('30 0 * * *', () => {
  console.log('cron_job');
  addIntrestToUser()
})


function addIntrestToUser(){
  db.getAllActiveInvestmentPlan().then((value) => {
      value.forEach((doc) => {
          switch(doc.data().investmentPlan) {
              case 'starter':
                db.updateActiveInvestmentIntrest(doc.id, starterIntrest(doc.data().investmentAmount, doc.data().btcBalance))
                break
              case 'premium':
                db.updateActiveInvestmentIntrest(doc.id, premiumIntrest(doc.data().investmentAmount, doc.data().btcBalance))   
                break
              case 'unlimited':
                db.updateActiveInvestmentIntrest(doc.id, unlimitedIntrest(doc.data().investmentAmount, doc.data().btcBalance))
                break
          }
      })
  })
}


function starterIntrest(investedAmount, currentAmount){
    var intrest = parseInt(investedAmount) * 0.0125
    return (parseInt(currentAmount) + intrest).toString()
}

function premiumIntrest(investedAmount, currentAmount){
    var intrest = parseInt(investedAmount) * 0.0135
    return (parseInt(currentAmount) + intrest).toString()
}

function unlimitedIntrest(investedAmount, currentAmount){
    var intrest = parseInt(investedAmount) * 0.015
    return (parseInt(currentAmount) + intrest).toString()
}

module.exports = cron