import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import sharp from 'sharp'
dotenv.config()

const s3 = new AWS.S3({accessKeyId: process.env.AWS_S3_ACCESS_KEY, secretAccessKey: process.env.AWS_S3_KEY_SECRET, region: process.env.AWS_S3_REGION})

const s3ImageUpload = async (file) => {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const mimeType = file.split(';')[0].split('/')[1]
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: buffer,
        Key: Date.now() + '.' + mimeType,
        ContentType: `image/${mimeType}`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}


const s3SharpImageUpload = async (file) => {
    const sharpImage = sharp(Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
    const metadata = await sharpImage.metadata();
  
    if (metadata.width < 984 || metadata.height < 114) {
        sharpImage.resize(984, 114);
    }
    const buffer = await sharpImage.toBuffer();
    const mimeType = file.split(';')[0].split('/')[1];
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: buffer,
        Key: `podbanners/${Date.now() + '.' + mimeType}`,
        ContentType: `image/${mimeType}`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    };

    // Upload to S3 and return the result
    return await s3Upload(params);
};

// Assuming you have an s3Upload function that handles the S3 upload
// You need to implement or use a library that provides the s3Upload function
// (e.g., using the AWS SDK)


// const s3SharpImageUpload = async (file) => {
//     const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
//     const data = sharp(buffer).resize(300).png({quality: 40})
//     const params = {
//         Bucket: process.env.AWS_S3_BUCKET,
//         Body: data,
//         Key: Date.now() + '.png',
//         ContentType: `image/png`,
//         CreateBucketConfiguration: {
//             LocationConstraint: process.env.AWS_S3_REGION
//         }
//     }
//     return await s3Upload(params)
// }

const userProfileImage = async (file) => {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const data = sharp(buffer).resize(400).png({quality: 50})
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: data,
        Key: 'palz.png',
        ContentType: `image/png`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}

const s3VideoUpload = async (file) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: file.buffer,
        Key: Date.now() + '.mp4',
        ContentType: `video/mp4`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}


const s3AudioUpload = async (file) => {
    const maxFileSizeInBytes = 50 * 1024 * 1024;

    // Extracting file type from the data URI
    const fileType = file.startsWith('data:audio/mp3') ? 'mp3' :
                     file.startsWith('data:audio/wav') ? 'wav' :
                     null;

    if (!fileType) {
        throw new Error('Unsupported file type. Supported types are "mp3" and "wav".');
    }

    const buffer = Buffer.from(file.replace(new RegExp(`^data:audio/${fileType};base64,`), ''), 'base64');

    if (buffer.length > maxFileSizeInBytes) {
        throw new Error('File size exceeds the maximum limit of 50 MB.');
    }

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: buffer,
        Key: `${Date.now()}.${fileType}`,
        ContentType: `audio/${fileType}`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    };

    return await s3Upload(params);
};

const s3Upload = async (params) => {
    try {
        let result = await s3.upload(params).promise()
        return result.Key
    } catch (e) {
        console.log('s3Upload error', e)
    }
}
const deleteImage = async (fileName) => {
    console.log('fileName', fileName)
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName
    }
    console.log('params', params)
    try {
        return await s3.deleteObject(params).promise()
    } catch (err) {
        console.log('File not found. Error is: ' + err.message)
    }
}
const deleteAudio = async (fileName) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName
    }

    try {
        console.log(1)
        return await s3.deleteObject(params).promise()
    } catch (err) {
        console.log('err', err)
        console.log('File not found. Error is: ' + err.message)
    }
}

//* for delete multiple image from S3 bucket
const deleteMultipleImage = async (fileName) => {
    let values = fileName?.map((e) => {
        return {Key: e}
    })
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: {
            Objects: values,
            Quiet: false
        }
    }

    try {
        let deletedData = await s3.deleteObjects(params).promise()
        console.log('deletedData', deletedData)
        return deletedData
    } catch (error) {
        console.log(error.message)
    }
}

// const getPicturesByFolder = (folderName,files) => {
//     return new Promise((resolve, reject) => {
//         s3.listObjectsV2(
//             {
//                 Bucket: process?.env?.AWS_S3_BUCKET,
//                 Prefix: 'uploads' + '/' + folderName + '/'
//             },
//             (err, data) => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     console.log("data",data);
//                     const listPictures= data?.Contents?.map((object) => object?.Key)
//                     resolve(listPictures)
//                 }
//             }
//         )
//     })
// }
const getPicturesByFolder = (folderName, files) => {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(
            {
                Bucket: process?.env?.AWS_S3_BUCKET,
                Prefix: 'uploads' + '/' + folderName + '/'
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                  if (files) {
                    const listPictures = data?.Contents?.map((object) => object?.Key);
                    const sortedPictures = listPictures.sort((a, b) => {
                        const indexA = files.indexOf(parseInt(a.split("/").pop())); // Extract the file number from the Key
                        const indexB = files.indexOf(parseInt(b.split("/").pop())); // Extract the file number from the Key
                        return indexA - indexB;
                    });
                    resolve(sortedPictures);
                  }else{
                    const listPictures = data?.Contents?.map((object) => object?.Key);
                    resolve(listPictures);
                  }
                    
                }
            }
        );
    });
};


const s3ImageUploadInFolder = async (files, folderName) => {
    const uploadResults = []
    let counter = 0
    const checkFolder = await getPicturesByFolder(folderName,files)
    const startIndex = checkFolder?.length
    const newNames = []
    for (let i = 0; i < files.length; i++) {
        const newNumber = startIndex + i
        const newFileName = `${newNumber.toString().padStart(2, '0')}.jpg`
        newNames.push(newFileName)
    }
    const filteredFiles = files.filter((value) => !checkFolder.includes(value))
    const filteredFolder = checkFolder.filter((value) => !files.includes(value))
    for (const file of filteredFiles) {
        const mimeTypeMatch = file.match(/^data:image\/(\w+);base64,/)
        if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
            console.error('Invalid MIME type for file:', file)
            continue
        }
        const mimeType = mimeTypeMatch[1]
        const fileName = newNames[counter]
        const key = `uploads/${folderName}/${fileName}`
        const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Body: buffer,
            Key: key,
            ContentType: `image/${mimeType}`,
            CreateBucketConfiguration: {
                LocationConstraint: process?.env?.AWS_S3_REGION
            }
        }
        const uploadResult = await s3Upload(params)
        uploadResults.push(uploadResult)
        counter++
    }
    const deleteObjects = await deleteMultipleImage(filteredFolder)
    return uploadResults
}

// const s3ImageUploadInFolder = async (files, folderName) => {
//     const uploadResults = [];
//     let counter = 0;

//     // Get the list of existing pictures in the folder
//     const checkFolder = await getPicturesByFolder(folderName,files);

//     // Create a mapping of filenames to their indexes in the 'files' array
//     const fileIndexMapping = {};
//     files.forEach((file, index) => {
//         fileIndexMapping[file] = index;
//     });

//     // Sort 'checkFolder' based on the order of filenames in 'files'
//     checkFolder.sort((a, b) => fileIndexMapping[a] - fileIndexMapping[b]);

//     const startIndex = checkFolder.length;
//     const newNames = [];
//     for (let i = 0; i < files.length; i++) {
//         const newNumber = startIndex + i;
//         const newFileName = `${newNumber.toString().padStart(2, '0')}.jpg`;
//         newNames.push(newFileName);
//     }

//     const filteredFiles = files.filter((value) => !checkFolder.includes(value));
//     const filteredFolder = checkFolder.filter((value) => !files.includes(value));

//     for (const file of filteredFiles) {
//         const mimeTypeMatch = file.match(/^data:image\/(\w+);base64,/);
//         if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
//             console.error('Invalid MIME type for file:', file);
//             continue;
//         }

//         const mimeType = mimeTypeMatch[1];
//         const fileName = newNames[counter];
//         const key = `uploads/${folderName}/${fileName}`;
//         const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
//         const params = {
//             Bucket: process.env.AWS_S3_BUCKET,
//             Body: buffer,
//             Key: key,
//             ContentType: `image/${mimeType}`,
//             CreateBucketConfiguration: {
//                 LocationConstraint: process?.env?.AWS_S3_REGION,
//             },
//         };

//         const uploadResult = await s3Upload(params);
//         uploadResults.push(uploadResult);
//         counter++;
//     }

//     const deleteObjects = await deleteMultipleImage(filteredFolder);

//     return uploadResults;
// };



export {s3VideoUpload, s3ImageUpload, deleteImage, s3SharpImageUpload, userProfileImage, deleteMultipleImage, s3AudioUpload, deleteAudio, getPicturesByFolder, s3ImageUploadInFolder}
