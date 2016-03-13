var assert = require('assert');
var fs = require('fs');

var Client = require('../storage.js').StorageClient;
var config = JSON.parse(fs.readFileSync('./tests/test-config/default.json'));

var TEST_CONTENT = "test content";

describe('test storage with default remote conf', function () {

    var storageClient;

    before(function (done) {
        storageClient = new Client(config.token, config.endpoint, config);
        done();
    });

    it('should store content', function (done) {
        storageClient.storeContent('/mydir1/test1.txt', TEST_CONTENT)
            .then(
                function (data) {
                    assert.equal(data.msg, 'OK');
                    done();
                },
                function (err) {
                    assert.fail('KO', 'OK', JSON.stringify(err));
                    done();
                });
    });


    it('should not be able to store twice on same target path', function (done) {
        storageClient.storeContent('/mydir1/test1.txt', TEST_CONTENT)
            .then(
                function (data) {
                    assert.fail('OK', 'KO', 'Same file stored twice');
                    done();
                },
                function (err) {
                    assert.equal(err.data.code, 'ERR-AE');
                    done(); ''
                });
    });


    it('should not be able to store file with suspicious path', function (done) {
        storageClient.storeContent('/mydir1/../../test1.txt', TEST_CONTENT)
            .then(
                function (data) {
                    assert.fail('OK', 'KO', 'Suspicious path not catched');
                    done();
                },
                function (err) {
                    assert.equal(err.data.code, 'ERR-IT');
                    done();
                });
    });

    it('should retrieve previously stored content', function (done) {
        storageClient.getContent('/mydir1/test1.txt').then(function (data) {
            assert.equal(data, TEST_CONTENT)
            done();
        },
            function (err) {
                assert.fail('KO', 'OK', "Cannot retrieve content");
                done();
            });
    });

    it('should retrieve content metadata', function (done) {
        storageClient.getContentInfo('/mydir1/test1.txt').then(function (data) {
            assert.equal(data.file_size, TEST_CONTENT.length)
            done();
        },
            function (err) {
                assert.fail('KO', 'OK', "Cannot retrieve content");
                done();
            });
    });

    it('should retrieve content to file', function (done) {
        var os = fs.createWriteStream('test-content');
        storageClient.get2Stream('/mydir1/test1.txt', os).then(function (data) {
            assert.equal(data.msg, 'OK');
            var fileContent = fs.readFileSync('test-content');
            assert.equal(fileContent, TEST_CONTENT);
            os.close();
            done();
        },
            function (err) {
                assert.fail('KO', 'OK', err);
                os.close();
                done();
            });
    });

    it('should remove content', function (done) {
        storageClient.deleteContent('/mydir1/test1.txt').then(function (data) {
            assert.equal(data.msg, 'File removed');
            done();
        },
            function (err) {
                assert.fail('OK', 'KO', JSON.stringify(err));
                done();
            });
    });

    it('should store content from file', function (done) {
        var is = fs.createReadStream('test-content-to-upload');
        var stats = fs.statSync('test-content-to-upload');
        var config2 = JSON.parse(JSON.stringify(config));
        config2.headers['content-length'] = stats.size;
        var storageClient2 = new Client(config2.token, config2.endpoint, config2);
        
        storageClient2.storeContent('/mydir1/test2.txt', is)
            .then(
                function (data) {
                    is.close();
                    assert.equal(data.msg, 'OK');
                    done();
                },
                function (err) {
                    is.close();
                    assert.fail('KO', 'OK', JSON.stringify(err));
                    done();
                });
    });

    it('should remove uploaded content', function (done) {
        storageClient.deleteContent('/mydir1/test2.txt').then(function (data) {
            assert.equal(data.msg, 'File removed');
            done();
        },
            function (err) {
                assert.fail('OK', 'KO', JSON.stringify(err));
                done();
            });
    });



});