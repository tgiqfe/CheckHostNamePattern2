/*  シリアルマッチのルール
 *  ~の右辺の桁数を、左辺の末尾から削ってから連番で検索
 *  ~の右辺のマッチングは \d+[a-zA-Z]*$
 *  ~の右辺が↑のパターン以外の場合は不正パターンとして、取り扱わない
 *  <マッチング例>
 *      Host005~010         〇 Host005～Host010
 *      Host020a~030a       〇 Host020a～Host030a
 *      Host03b05~10b10     × 右辺が不正
 *      HostHost~HosU       × 右辺が不正
 *      Host001b~005c       △ Host001c～Host005c 左辺の末尾「b」は無視
 *      HostAAAA~050t       △ Host000t～Host050t 左辺の末尾「AAAA」無視。左辺末尾に数字が見つからない為、0からスタート
 *      Host0001a~030       △ Host00000～Host00030 SufName無しの為、左辺末尾を削る際、「a」を無視。「01a」を数字として扱えない為、0からスタート
 *      Host0015a~20bb      △ Host001bb～Host020bb 左辺末尾の「5a」を無視し、01からのスタート
 *                          ※正直言って、△のパターンはやめてほしい。。。
 *                          ※チェック元のマシンのホスト名とフォルダー名のマッチングを想定しているので、ホスト名やフォルダー名に使えない文字はそもそもNG
 *                          　DNSのホスト名部分、NetBIOS名、フォルダー名の全部の禁止文字を禁止した後で、「%」と「~」を許可と、大文字/小文字許可する、という考え方。
 *                          　使用可能文字を羅列すると、a～z A～Z 0～9 - ~ %
 *
 *  各部の名称
 *  Aaaa001b~099b
 *  ↓
 *  Aaaa    | 001    | b       | ~    | 099    | b
 *  ~~~~    | ~~~    | ~       |      | ~~~    | ~
 *  PreName | MinNum | SufName | 無視 | MaxNum | SufName
 *                     ↑正確にはここは無視
 */

/*  ワイルドカードマッチのルール
 *  名前の中の「%」の部分をワイルドカードとして判断。「*」がフォルダー名に使用できないので。
 *  シリアルマッチとワイルドカードマッチは同時使用不可
 */

var namePattern = function () {

    //  クラスパラメータ
    this.available = false;
    this.isSerialMatch = true;

    //  マッチングパターンをセット
    this.setNamePattern = function (sourceText) {
        if (sourceText.match(/^[a-zA-Z0-9]+~\d+[a-zA-Z]*$/) !== null) {
            var leftSide = sourceText.substring(0, sourceText.indexOf("~")).toLowerCase();
            var rightSide = sourceText.substring(sourceText.indexOf("~") + 1).toLowerCase();
            var tempMaxNum = rightSide.match(/^\d+/)[0];
            var tempInt = 0;
            this.digit = tempMaxNum.length;
            this.sufName = (tmpSuf = rightSide.match(/\D+$/)) === null ? "" : tempSuf;
            this.preName = leftSide.substring(0, leftSide.length - this.digit - this.sufName.length);
            this.maxNum = parseInt(tempMaxNum, 10);
            this.minNum =
                tempInt = leftSide.substring(this.preName.length, this.digit).tryParse([tempInt]) ? tempInt : 0;
            this.isSerialMatch = true;
            this.available = true;
        } else if (sourceText.match(/^[a-zA-Z0-9\-]*%[a-zA-Z0-9\-%]*$/) !== null) {
            this.wildCardName = sourceText.replace(/%/g, ".*");
            this.isSerialMatch = false;
            this.available = true;
        } else {
            this.hostName = sourceText.toLowerCase();
        }
    };

    //  名前チェック
    this.checkName = function (targetName) {
        if (this.available) {
            if (this.isSerialMatch) {
                if (targetName.toLowerCase().startsWith(this.preName) && targetName.toLowerCase().endsWith(this.sufName)) {
                    for (var i = this.minNum; i <= this.maxNum; i++) {
                        if (this.preName + ("0".repeat(this.digit) + i).slice(-this.digit) + this.sufName === targetName.toLowerCase()) {
                            return true;
                        }
                    }
                }
            } else {
                if (new RegExp(this.wildCardName, "gi").test(targetName)) {
                    return true;
                }
            }
        } else {
            if (this.hostName === targetName.toLowerCase()) {
                return true;
            }
        }
        return false;
    };
};
module.exports = namePattern;