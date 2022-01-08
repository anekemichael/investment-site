class userModel{
    constructor(uid, investmentId, fullName, gender, address, 
        referralCode, country, emailAddress,
        isEmailVerified, password, bankName,
        accountName, accountNumber, btcWallet, 
        etherumWallet, usdt, bnbWallet, inviteeReferralCode, phone) {
            this.uid = uid,
            this.investmentId = investmentId
            this.fullName = fullName
            this.gender = gender
            this.address = address
            this.referralCode = referralCode
            this.country = country
            this.emailAddress = emailAddress
            this.isEmailVerified = isEmailVerified
            this.password = password
            this.bankName = bankName
            this.accountName = accountName
            this.accountNumber = accountNumber
            this.btcWallet = btcWallet
            this.etherumWallet = etherumWallet
            this.usdt = usdt
            this.bnbWallet = bnbWallet
            this.inviteeReferralCode = inviteeReferralCode
            this.phone = phone
        }

        toMap(){
            return{
                uid : this.uid,
                investmentId : this.investmentId,
                fullName : this.fullName,
                gender : this.gender,
                address : this.address,
                referralCode : this.referralCode,
                country : this.country,
                emailAddress : this.emailAddress,
                isEmailVerified : this.isEmailVerified,
                password : this.password,
                bankName : this.bankName,
                accountName : this.accountName,
                accountNumber : this.accountNumber,
                btcWallet : this.btcWallet,
                etherumWallet : this.etherumWallet,
                usdt : this.usdt,
                bnbWallet : this.bnbWallet,
                inviteeReferralCode: this.inviteeReferralCode,
                phone: this.phone
            }
        }
}

module.exports = userModel