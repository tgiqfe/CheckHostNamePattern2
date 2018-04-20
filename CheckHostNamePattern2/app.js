
String.prototype.tryParse = (numSet) => {
    if (!isNaN(this)) {
        numSet[0] = parseInt(this, 10);
        return true;
    }
    return false;
};

var os = require('os');
var namePattern = require('./namePattern.js');
var np = new namePattern();

np.setNamePattern("Host001");           //  ホスト名が Host001 の場合にマッチ
//np.setNamePatttern("Host001~005");    //  ホスト名が Host001 ～ 005 の場合にマッチ
//np.setNamePatttern("Hos%");           //  ホスト名が Hos* の場合にマッチ
//np.setNamePattern("Host001a~005a");   //  ホスト名が Host001a ～ 005a の場合にマッチ

var result = np.checkName(os.hostname());
console.log(result);
