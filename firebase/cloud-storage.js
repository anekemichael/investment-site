const { getStorage, ref } = require('firebase/storage')
const myApp = require('../firebase/init')
const storageBucket = getStorage(myApp)


// Create a storage reference from our storage service
const storageRef = ref(storageBucket)
const imagesRef = ref(storageBucket, 'images')


