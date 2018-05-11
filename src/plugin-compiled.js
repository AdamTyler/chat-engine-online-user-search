'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Searches a {@link Chat} for a {@link User} with a ```state.username``` containing a given string.
* @module chat-engine-online-user-search
*/

var dotty = require('dotty');

/**
* @function
* @param {Object} [config] The config object
* @example
* //providing a config is optional, the defaults are below
* let config = { prop: 'uuid', caseSensitive: false }
* chat.plugin(ChatEngineCore.plugin['chat-engine-online-user-search'](config));
*
* let results = chat.onlineUserSearch.search('foo');
*/
module.exports = function (config) {

    config = config || {};
    config.prop = config.prop || 'uuid';
    config.caseSensitive = config.caseSensitive || false;

    // these are new methods that will be added to the extended class

    /**
    * @method  search
    * @ceextends Chat
    * @param {String} needle The username to search for.
    * @returns {Array} An array of {@link User}s that match the input string.
    */

    var extension = function () {
        function extension() {
            _classCallCheck(this, extension);
        }

        _createClass(extension, [{
            key: 'search',
            value: function search(needle) {

                // an empty array of users we found
                var returnList = [];

                if (!config.caseSensitive) {
                    needle = needle.toLowerCase();
                }

                // for every user that the parent chat knows about
                for (var key in this.parent.users) {

                    var haystack = this.parent.users[key];
                    var target = dotty.get(haystack, config.prop);

                    // see if that user username includes the input text
                    if (haystack && target) {

                        if (!config.caseSensitive) {
                            target = target.toLowerCase();
                        }

                        if (target.indexOf(needle) > -1) {

                            // if it does, add it to the list of returned users
                            returnList.push(this.parent.users[key]);
                        }
                    }
                }

                // return all found users
                return returnList;
            }
        }]);

        return extension;
    }();

    // add this plugin to the Chat classes


    return {
        namespace: 'onlineUserSearch',
        extends: {
            Chat: extension,
            GlobalChat: extension
        }
    };
};
