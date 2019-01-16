##### Requirements:
  - Twilio account and phone number to send messages from
  - lambda with ACCOUNT_ID, AUTH_TOKEN, FROM_NUMBER environment variables set
  - csv in an S3 bucket with the names and numbers to be contacted

United States destinations only.


##### CSV format:
```
name,phoneNumber
Anony Mouse,1234567890
```

##### Payload:
```
{
  s3: {
    bucketName: 'name',
    bucketKey: 'key',
  },
  message: 'message'
}
```
