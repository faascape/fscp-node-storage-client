# What is it ?

A simple nodejs helper promises based library to use universal storage api from Faascape platform (https://www.faascape.com).

You can use your own accounts for each provider or access everything with your Faascape account.

To change target provider, you have to use the faascape dashboard management or provide several system variables.

There is currently three providers available :

- Amazon S3
- Microsoft Azure Storage
- Google Storage

Region used for storage depends of the choosen access point.

More providers will be automatically supported as Faascape integrates them.

This is a very future proofed way to manage your storage. If you want to change your provider or have different providers for various project, you don't have to change your script.  

# A word about security

Two modes of operation may be used :

- standard : you retrieve a token from the Faascape platform and use it to call faascape endpoints.
- autonomous : you can provide your own credentials related to target provider when calling Faascape endpoint. Of course, it is not good security practice to handover your private id to a third party. This feature has been essentially provided to handle local Faascape proxy but you can use if needed on remote proxies. We plan to build a docker image to distribute as a standard local proxy.

# Install

```
npm install fscp-node-storage-client --save

```

# store content from string

```
var Client = require('fscp-node-storage-client').StorageClient;

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com');

client.storeContent('/my-path/my-file', 'ABCDEF').then(function(data) {
    console.log('md5sum is : ', data.hash);
    });
```


# store content from stream

```
var fs = require('fs');
var Client = require('fscp-node-storage-client').StorageClient;

var is = fs.createReadableStream('my-file.txt');

// some providers doesn't support chunked encoding
var stats = fs.statSync('my-file.txt');
var options = {
    headers: {
        'content-length':stats.size
    }
};

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com', options);


client.storeContent('/my-path/my-file', is).then(function(data) {
    console.log('md5sum is : ', data.hash);
    });
```

# get content

```
var Client = require('fscp-node-storage-client').StorageClient;

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com');

client.getContent('/my-path/my-file').then(function(data) {
    console.log('content is : ', data);
    });
```

# get content to stream

```
var Client = require('fscp-node-storage-client').StorageClient;

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com');

var os = fs.createWriteStream('my-retrieved-content');
client.get2Stream('/my-path/my-file', os).then(function(data) {
    os.close();
    console.log('result is : ', data);
    });
```

# get content metadata

```
var Client = require('fscp-node-storage-client').StorageClient;

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com');

client.getContentInfo('/my-path/my-file').then(function(data) {
    console.log('content is : ', data);
    });
```

# get directory content

```
var Client = require('fscp-node-storage-client').StorageClient;

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com');

client.getContent('/my-path').then(function(data) {
    console.log('directory content is : ', data);
    });
```

# remove content

```
var Client = require('fscp-node-storage-client').StorageClient;

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com');

client.deleteContent('/my-path/my-file').then(function(data) {
    console.log('result is : ', data);
    });
```

# use your own third party account

```
var fs = require('fs');
var Client = require('fscp-node-storage-client').StorageClient;

var is = fs.createReadableStream('my-file.txt');

// some providers doesn't support chunked encoding
var stats = fs.statSync('my-file.txt');
var options = {
    headers: {
        'content-length':stats.size
    }
};

var client = new Client('MY-TOKEN', 'https://api.amz-eu-west-1.faascape.com', options);


client.storeContent('/my-path/my-file', is).then(function(data) {
    console.log('md5sum is : ', data.hash);
    });
```



# How does it work ?

This script just send http requests to a Faascape endpoint and build all headers value to be able to use all Faascape features related to provider management.


# License

Simplified BSD License
