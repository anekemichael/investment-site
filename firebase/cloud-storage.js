const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage')
const myApp = require('../firebase/init')
const storageBucket = getStorage(myApp)
const firsestore = require('../firebase/firestore')
var httpMsgs = require('http-msgs')
const fs = require('fs')

const metadata = {
    contentType: 'image/jpeg'
}



function uploadFileToCloudStorage(filePath, fileName, uid, req, res){
    var readFile = fs.readFileSync(filePath)
    const imagesRef = ref(storageBucket, 'images/' +  fileName)
    const uploadTask = uploadBytesResumable(imagesRef, readFile, metadata)
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed', 
    (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        switch (snapshot.state){
            case 'success':
                console.log('Upload is successful');
                break
            case 'paused':
                console.log('Upload is Paused');
                break
            case 'running':
                console.log('Upload is running');
                break
        }
    }, (error) => {
        switch (error.code){
            case 'storage/unauthorized':
                console.log('User doesnt have permission to access the object');
                break;
           case 'storage/canceled':
               console.log('User canceled the upload');
               break;
            case 'storage/unknown':
               console.log(' Unknown error occurred, inspect error.serverResponse');
               break;
        }
    }, () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            //save to firestore
            firsestore.updateInvestmentPaln(uid, downloadUrl).then(() => {
                httpMsgs.sendJSON(req, res, {result: "success"})
            })
        })
    })
}

module.exports = {
    uploadFileToCloudStorage: uploadFileToCloudStorage
}