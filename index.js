const AWS = require('aws-sdk');
const csv = require('csvtojson');

const s3 = new AWS.S3();

const { ACCOUNT_ID, AUTH_TOKEN, FROM_NUMBER } = process.env;
const client = require('twilio')(ACCOUNT_ID, AUTH_TOKEN);

async function sendMessage(toNumber, message) {
  console.log(`Sending message to ${toNumber}`);
  console.log(`Message: ${message}`);
  client.messages
    .create({
      body: message,
      from: `+1${FROM_NUMBER}`,
      to: `+1${toNumber}`,
    })
    .then((response) => {
      console.log(`Twilio response ${response.sid}to ${response.to} returned with status: ${response.status}`);
    })
    .done();
}

async function getS3Object(bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Body.toString());
      }
    });
  });
}

exports.handler = async (event) => {
  const { s3: { bucketName, bucketKey }, message } = event;
  const data = await getS3Object(bucketName, bucketKey);
  const json = await csv().fromString(data);

  for (const row of json) {
    sendMessage(row.phoneNumber, message);
  }
  return {};
};
