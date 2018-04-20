
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

np.setNamePattern("Host001");           //  �z�X�g���� Host001 �̏ꍇ�Ƀ}�b�`
//np.setNamePatttern("Host001~005");    //  �z�X�g���� Host001 �` 005 �̏ꍇ�Ƀ}�b�`
//np.setNamePatttern("Hos%");           //  �z�X�g���� Hos* �̏ꍇ�Ƀ}�b�`
//np.setNamePattern("Host001a~005a");   //  �z�X�g���� Host001a �` 005a �̏ꍇ�Ƀ}�b�`

var result = np.checkName(os.hostname());
console.log(result);
