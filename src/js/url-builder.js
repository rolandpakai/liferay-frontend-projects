'use strict';

// External protocols regex, supports:
// "http", "https", "//" and "www."
var REGEX_EXTERNAL_PROTOCOLS = /^https?:\/\/|\/\/|www\./;

/**
 * Creates an instance of URLBuilder class.
 *
 * @constructor
 * @param {object} - instance of {@link ConfigParser} object.
 */

function URLBuilder(configParser) {
    this._configParser = configParser;
}

URLBuilder.prototype = {
    constructor: URLBuilder,

    /**
     * Returns a list of URLs from provided list of modules.
     *
     * @param {array} modules List of modules for which URLs should be created.
     * @return {array} List of URLs.
     */
    build: function (modules) {
        var buffer = [];
        var result = [];

        var registeredModules = this._configParser.getModules();
        var config = this._configParser.getConfig();

        var basePath = config.basePath;

        /* istanbul ignore else */
        if (basePath.charAt(basePath.length - 1) !== '/') {
            basePath += '/';
        }

        for (var i = 0; i < modules.length; i++) {
            var module = registeredModules[modules[i]];

            // If module has fullPath, individual URL have to be created.
            if (module.fullPath) {
                result.push(module.fullPath);

            } else {
                var path = this._getModulePath(module);

                // If the URL starts with external protocol, individual URL shall be created.
                if (REGEX_EXTERNAL_PROTOCOLS.test(path)) {
                    result.push(path);

                    // If combine is disabled, create individual URL based on config URL and module path.
                } else if (!config.combine) {
                    result.push(config.url + basePath + path);

                } else {
                    // If combine is true and module does not have full path, it will be collected
                    // in a buffer to be loaded among with other modules from combo loader.
                    buffer.push(path);
                }
            }

            module.requested = true;
        }

        // Add to the result all modules, which have to be combined.
        if (buffer.length) {
            result.push(config.url + basePath + buffer.join('&' + basePath));

            buffer.length = 0;
        }

        return result;
    },

    /**
     * Returns the path for a module. If module has property path, it will be returned directly. Otherwise,
     * the name of module will be used and extension .js will be added to module name if omitted.
     *
     * @protected
     * @param {object} module The module which path should be returned.
     * @return {string} Module path.
     */
    _getModulePath: function (module) {
        var path = module.path || module.name;

        var paths = this._configParser.getConfig().paths;

        for (var key in paths) {
            /* istanbul ignore else */
            if (Object.prototype.hasOwnProperty.call(paths, key)) {
                if (path === key || path.indexOf(key + '/') === 0) {
                    path = paths[key] + path.substring(key.length);
                }
            }
        }

        if (!REGEX_EXTERNAL_PROTOCOLS.test(path) && path.indexOf('.js') !== path.length - 3) {
            path += '.js';
        }

        return path;
    }
};