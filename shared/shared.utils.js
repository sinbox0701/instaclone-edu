import AWS from "aws-sdk";

AWS.config.update({
    credentials:{
        accessKeyId:process.env.AWS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY
    }
});

export const uploadToS3 = async (file,userId,folderName) => {
    const {filename, createReadStream} = await file;
    const readStream = createReadStream();
    const objectName = `${folderName}-${userId}-${Date.now()}-${filename}`;
    //editProfile에서 했던 내용
    const {Location} = await new AWS.S3().upload({
        Bucket:"instaclonedu",
        Key:objectName,
        ACL:"public-read",
        Body:readStream
    }).promise();
    //AWS.S3().upload().promise()를 하면 return값으로 promise 객체가 나오는데 객체 안에 포함된 것 중 Location이 이미지가 저장되는 url을 반환해주는 return 값이라 그걸 가져옴
    //우리는 DB에 이미지가 저장되는 URL을 저장할것이기 때문
    return Location;
}