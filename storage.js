var HttpClient = require('fscp-http-client').Client;
var Promise = require('bluebird');



function buildHeaders(options) {
    if(!options) {
        return null;
    }
    var headers = options.headers||{};
    if(options.provider) {
        headers['x-fscp-provider'] = options.provider;
    }
    if(options.key) {
        headers['x-fscp-key'] = options.key;
        if(!options.secret) {
            throw 'MissingSecret';
        }
        headers['x-fscp-secret'] = options.secret;
        if(!options.bucket) {
            throw 'MissingBucket';
        }
        headers['x-fscp-bucket'] = options.bucket;
        if(options.provider == 'google/google') { 
            if(!options.googleId) {
                throw 'MissingGoogleId';
            }
            headers['x-fscp-google-id'] = options.googleId;
        }
    }
    return headers;
}

var StorageClient = exports.StorageClient = function(token, endpoint, options) {
    this.token = token;
    this.endpoint = endpoint;
    this.headers = buildHeaders(options);
};




StorageClient.prototype.storeContent = function(path, content) {
    var client = new HttpClient(this.endpoint);
    self = this;
    return new Promise(function(resolve, reject) {
        client.doPost(self.token, 
            '/storage'+path, 
            self.headers, 
            content, 
            function(err, res, data) {
                if(err || res.statusCode != 200) {
                    reject({error:err, statusCode:res?res.statusCode:0, data:data?JSON.parse(data):{}});
                }
                else {
                    resolve(JSON.parse(data));
                }
        });        
    });    
};

StorageClient.prototype._get = function(path, info) {
    var client = new HttpClient(this.endpoint);
    self = this;
    return new Promise(function(resolve, reject) {
        client.doGet(self.token, 
            '/storage'+path+(info ? '?info' : ''),
            function(err, res, data) {
                if(err || res.statusCode != 200) {
                    reject({error:err, statusCode:res?res.statusCode:0});
                }
                else {
                    resolve(info ? JSON.parse(data) : data);
                }
        });        
    });    
};


StorageClient.prototype.getContent = function(path) {
    return this._get(path);        
};

StorageClient.prototype.getContentInfo = function(path) {
    return this._get(path, true);    
};



StorageClient.prototype.get2Stream = function(path, writableStream) {
    var client = new HttpClient(this.endpoint);
    self = this;
    return new Promise(function(resolve, reject) {
        client.doGet2Stream(self.token, 
            '/storage'+path,
            null,
            writableStream,
            function(err, res, data) {
                if(err || res.statusCode != 200) {
                    reject({error:err, statusCode:res?res.statusCode:0});
                }
                else {
                    resolve({msg:"OK"});
                }
        });        
    });    
};



StorageClient.prototype.deleteContent = function(path) {
    var client = new HttpClient(this.endpoint);
    self = this;
    return new Promise(function(resolve, reject) {
        client.doDelete(self.token, 
            '/storage'+path,
            function(err, res, data) {
                if(err || res.statusCode != 200) {
                    reject({error:err, statusCode:res?res.statusCode:0});
                }
                else {
                    resolve(JSON.parse(data));
                }
        });        
    });       
};

