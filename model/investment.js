const fireStoreHelper = require('../firebase/firestore')

class InvestmentModel {
    constructor(investmentAmount, investmentStatus, investmentInvoice, investmentPlan,
    investedDate, withdrawalDate, investmentProof ,btcBalance, bnbBalance, usdtBalance,
    etherumBalance) {
        this.investmentAmount = investmentAmount
        this.investmentStatus = investmentStatus
        this.investmentInvoice = investmentInvoice
        this.investmentPlan = investmentPlan
        this.investedDate = investedDate
        this.withdrawalDate = withdrawalDate
        this.investmentProof = investmentProof
        this.btcBalance = btcBalance
        this.bnbBalance = bnbBalance
        this.usdtBalance = usdtBalance
        this.etherumBalance = etherumBalance
    }


    toMap(){
        return{
            investmentAmount: this.investmentAmount,
            investmentStatus: this.investmentStatus,
            investmentInvoice: this.investmentInvoice,
            investmentPlan: this.investmentPlan,
            investedDate: this.investedDate,
            withdrawalDate: this.withdrawalDate,
            investmentProof: this.investmentProof,
            btcBalance: this.btcBalance,
            bnbBalance: this.bnbBalance,
            usdtBalance: this.usdtBalance,
            etherumBalance: this.etherumBalance
        }
    }

    recentInvestment(sn, action, plan, amount, dayCounter, coinValue, coinType, status){
        return {
            sn: sn,
            action: action,
            plan: plan,
            amount: amount,
            dayCounter: dayCounter,
            coinValue: coinValue,
            coinType: coinType,
            status: status
        }
    }
}



module.exports = InvestmentModel