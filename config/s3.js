const AWS = require('aws-sdk')
const fs = require('fs')
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'ap-south-1'
})



async function uploadFileFunction(filename, path){
    const fileContent = fs.readFileSync(path)
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: fileContent
      }
    try{  
        await s3.upload(params).promise()
        return { status:'ok' }
    }catch(e){ 
        return { status:'error', message: e.message  }
    }

}

function getPresignedUrl(filename){
    const url =  s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Expires: 60*5
    })
    return url
}

module.exports ={ uploadFileFunction, getPresignedUrl }