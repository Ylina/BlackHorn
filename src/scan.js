/**
 * @Author Ylina Greed
 * 
 * Execute all the scans needed to find monitoring access
 */

var P = require('p-promise');

function scanOneDeep(IP) {
    var deferred = P.defer();
    var spawn = require('child_process').spawn;
    var nmap = spawn('nmap',['-n',IP,'-O','-sU','-p','U:161,T:5666']);

    var queryResult = '';
    var errorResult;
    nmap.stdout.on('data', function(data) {
        queryResult+=data;
    });
    nmap.stderr.on('data', function (data) {
        errorResult = errorResult !== undefined ? errorResult+data : ''+data;
    });
    nmap.on('exit', function (code) {
        console.log('.');
        if (errorResult)
            deferred.reject(errorResult);
        else
            deferred.resolve(queryResult);
    });

    return deferred.promise;
}


function getHostsUp(range, callback) {

    var deferred = P.defer();

    var spawn = require('child_process').spawn;
    var nmap = spawn('nmap',['-n',range,'-sP']);
    var queryResult = '';
    var errorResult;
    nmap.stdout.on('data', function(data) {
        queryResult+=data;
    });
    nmap.stderr.on('data', function (data) {
        errorResult = errorResult !== undefined ? errorResult+data : ''+data;
    });
    nmap.on('exit', function (code) {
        if (errorResult)
            deferred.reject(errorResult);
        else
            deferred.resolve(queryResult.match(/\d*\.\d*\.\d*\.\d*/g));
    });

    return deferred.promise;
}

exports.getHostsUp = getHostsUp;
exports.scanOneDeep = scanOneDeep;
