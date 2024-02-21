import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config()

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

// C:\Users\Admin\Documents\NODEJS\Twitter-Clone-v2\Twitter\uploads\images\5b5c577967cf05b2e2ddac800.jpg
const file = fs.readFileSync(path.resolve('uploads\\images\\hinh2.jpg'))
const parallelUploads3 = new Upload({
  client: s3,
  params: { Bucket: 'twitter-clone-singapore', Key: 'anh.jpg', Body: file, ContentType: 'image/jpeg' },
  tags: [
    /*...*/
  ], // optional tags
  queueSize: 4, // optional concurrency configuration
  partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
  leavePartsOnError: false // optional manually handle dropped parts
})

parallelUploads3.on('httpUploadProgress', (progress) => {
  console.log(progress)
})

parallelUploads3.done().then((res) => {
  console.log(res)
})
