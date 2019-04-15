'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    Rectangle.prototype.getArea = function(){
        return this.width*this.height;
    }
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    let jsonObject = JSON.parse(json);
    Object.setPrototypeOf(jsonObject, proto);
    return jsonObject;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
    constructor() {
        this.classes = [];
        this.attrs = [];
        this.pseudoClasses = [];
        this.unused = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement', 'combine'];
    }

    static get duplicateError() {
        return new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
    }

    static get orderError() {
        return new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
    }

    order_check(curr_elem) {
        if (!this.unused.includes(curr_elem)) throw Selector.orderError;
        while(this.unused[0] != curr_elem) this.unused.shift();
    }

    element(value) {
        this.order_check('element');
        if(this.element_val) throw Selector.duplicateError;
        this.element_val = value;
        return this;
    }

    id(value) {
        this.order_check('id');
        if(this.id_val) throw Selector.duplicateError;
        this.id_val = value;
        return this;
    }

    class(value) {
        this.order_check('class');
        this.classes.push(value);
        return this;
    }

    attr(value) {
        this.order_check('attr');
        this.attrs.push(value);
        return this;
    }

    pseudoClass(value) {
        this.order_check('pseudoClass');
        this.pseudoClasses.push(value);
        return this;
    }

    pseudoElement(value) {
        this.order_check('pseudoElement');
        if(this.pseudoElement_val) throw Selector.duplicateError;
        this.pseudoElement_val = value;
        return this;
    }

    combine(selector1, combinator, selector2) {
        this.order_check('combine');
        Object.assign(this, selector1);
        this.combinator = combinator;
        this.selector2 = selector2;
        return this;
    }

    stringify() {
        let ans = '';
        ans += (this.element_val || '');
        if (this.id_val) ans += '#' + this.id_val;
        this.classes.forEach(elem => ans += '.' + elem);
        this.attrs.forEach(elem => ans += '[' + elem + ']');
        this.pseudoClasses.forEach(elem => ans += ':' + elem);
        if (this.pseudoElement_val) ans += '::' + this.pseudoElement_val;
        if (this.combinator && this.selector2) ans += ' ' + this.combinator + ' ' + this.selector2.stringify();
        return ans;
    }
}

const cssSelectorBuilder = {
    element: function(value) {
        return new Selector().element(value);
    },

    id: function(value) {
        return new Selector().id(value);
    },

    class: function(value) {
        return new Selector().class(value);
    },

    attr: function(value) {
        return new Selector().attr(value);
    },

    pseudoClass: function(value) {
        return new Selector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new Selector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new Selector().combine(selector1, combinator, selector2);
    }
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
