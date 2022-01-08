const { status } = require('express/lib/response')
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

    recentInvestment(action, plan, amount, coinType, status, createdAt){
        return {
            action: action,
            plan: plan,
            amount: amount,
            coinType: coinType,
            status: status,
            createdAt: createdAt
        }
    }

    recentWithdrawal(action, amount, calculatedAmount, status, coinType, settlementStatus, createdAt){
        return {
            action: action,
            amount: amount,
            calculatedAmount: calculatedAmount, 
            status: status,
            coinType: coinType,
            settlementStatus: settlementStatus,
            createdAt: createdAt
        }
    }
}


module.exports = InvestmentModel