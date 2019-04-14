'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    let resArr = [];
    let dir = "";
    let degrees = 0;
    var sides = ['N', 'E', 'S', 'W'];  // use array of cardinal directions only!
    for (let i = 0; i < sides.length; i++) {
        let btwcardinal = (i == 0 || i == 2) ? (sides[i] + sides[i + 1])
            : (sides[i == 3 ? 0 : i + 1] + sides[i]);
        for (let count = 0; count < 8; count++) {
            switch (count) {
                case 0: dir = sides[i]; break;
                case 1: dir = sides[i] + 'b' + sides[i == 3 ? 0 : i + 1]; break;
                case 2: dir = sides[i] + btwcardinal; break;
                case 3: dir = btwcardinal + "b" + sides[i]; break;
                case 4: dir = btwcardinal; break;
                case 5: dir = btwcardinal + "b" + sides[i == 3 ? 0 : i + 1]; break;
                case 6: dir = sides[i == 3 ? 0 : i + 1] + btwcardinal; break;
                case 7: dir = sides[i == 3 ? 0 : i + 1] + "b" + sides[i]; break;
            }
            resArr.push({ abbreviation: dir, azimuth: degrees });
            degrees += 11.25;
        }
    }
    return resArr;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let toExpand = [str];
    let appeared = new Array();
    let matched, replacementArr;
    while (toExpand.length > 0) {
        str = toExpand.pop();
        matched = str.match(/{([^{}]*)}/);
        if (matched != null) {
            replacementArr = matched[1].split(',');
            for (let replacement of replacementArr) {
                toExpand.push(str.replace(matched[0], replacement));
            }
        } else if (!appeared.includes(str)) {
            appeared.push(str);
            yield str;
        }
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = new Array(n);
    }

    let valuesCnt = Math.pow(n, 2);
    let i = 0, j = 0;
    for (let value = 0; value < valuesCnt; value++) {
        result[i][j] = value;
        if ((i + j) % 2 == 0) {
            if (j + 1 < n) {
                j++;
            } else {
                i += 2;
            }
            if (i > 0) {
                i--;
            }
        } else {
            if (i + 1 < n) {
                i++;
            } else {
                j += 2;
            }
            if (j > 0) {
                j--;
            }
        }
    }
    return result;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    const result = Array(1);
    result[0] = dominoes.shift();

    let lastLength = 0;
    while (lastLength != dominoes.length && dominoes.length > 0) {
        lastLength = dominoes.length;
        for (let i = 0; i < dominoes.length; i++) {
            if (result[result.length - 1][1] == dominoes[i][0] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i];
                dominoes.splice(i, 1);
            } else if (result[result.length - 1][1] == dominoes[i][1] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i].reverse();
                dominoes.splice(i, 1);
            }
        }
    };

    return dominoes.length == 0;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let counter = 0;
    let str = '';
    str += nums[0];
    let prev = nums[0];
    for(let i = 1; i < nums.length; i++){
        if(nums[i] - prev == 1){
            counter++;
            prev = nums[i];
        }
        else{
            if(counter == 1){
                str += ',' + prev;
                prev = nums[i];
                counter = 0;
            }
            if(counter > 1){
                str += '-' + prev;
                prev = nums[i];
                str += ',' + prev;
            }
            if(counter == 0){
                prev = nums[i];
                str += ',' + prev;
            }
            counter = 0;
        }
        if((i == nums.length - 1) && (counter != 0)){
            if (counter > 1)
                str += '-' + prev;
            else
                str += ',' + prev;
            counter = 0;
        }

    }
    return str;
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
