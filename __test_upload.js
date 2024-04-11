const { Storage } = require('@google-cloud/storage');

// Initialize storage
const storage = new Storage({
  keyFilename: './shop3-api-db2b21cda2fa.json',
});

const bucketName = 'media-bucket-dev';
const bucket = storage.bucket(bucketName);

// Sending the upload request
bucket.upload(
  './kali_linux.jpg',
  {
    destination: 'public/seller/avatar/kali_linux_04.jpg',
  },
  (err, file) => {
    if (err) {
      console.error(`Error uploading image kali_linux.jpg: ${err}`);
    } else {
      console.log(`Image kali_linux.jpg uploaded to ${bucketName}.`);
      file.makePublic(async (errPub) => {
        if (errPub) {
          console.error(`Error making file public: ${errPub}`);
        } else {
          console.log(`File ${file.name} is now public.`);
          const publicUrl = file.publicUrl();
          console.log(`Public URL for ${file.name}: ${publicUrl}`);
        }
      });
    }
  },
);
