var http = require("http");
var Class = require("prototype").Class;

/** This class allows to communicate over the Junar API.
 * @class
 */
var Junar = module.exports = Class.create(
/** @lends Junar */
{

  /** Constructs a new Junar object and sets the configured HTTP client.
   *
   * @param {Object} theClient Compatible http-client interface. Cannot be
   *    null.
   */
  initialize : function(theClient) {
    this.http = theClient;
  },

  /** Executes a data stream and returns its result in JSON format.
   *
   * @param {String} id Id of the stream to query on. Cannot be null
   *    or empty.
   * @param {String[]} args Arguments passed to the query. Cannot be
   *    null.
   * @param {Function} callback Function invoked when the data
   *    is available. Cannot be null.
   */
  stream : function(id, args, callback) {
    var params = {};

    args.each(function(argument, index) {
      params["pArgument" + index] = argument;
    });

    this.http.get("/datastreams/invoke/" + id, params, callback);
  },

  /** Returns the data streams matching the query criteria in their
   * titles, descriptions and tags. The result is provided as an
   * array of data stream objects.
   *
   * @param {String} query Encoded query terms see below for options.
   *    Cannot be null or empty.
   * @param {Number} maxResults The number of data streams to return,
   *    up to a max of 100, default 100.
   * @param {Function} callback Function invoked when the data
   *    is available. Cannot be null.
   */
  searchStream : function(query, maxResults, callback) {
    this.http.get("/datastreams/search/", {
      query : query,
      max_results : maxResults
    }, callback);
  }
});

Object.extend(Junar, {
  /** Host to access the Junar API. It's never null or empty.
   * @type String
   */
  apiHost : "apisandbox.junar.com",

  /** Performs a HTTP request against the Junar API.
   * @param {String} uri Action URI. Cannot be null or empty.
   * @param {Object} params Request parameters. Cannot be null.
   * @param {Object} options Options for this request. See
   *    <code>create()</code> for further information. Cannot be null.
   * @param {Function} callback Function invoked when the data
   *    is available. Cannot be null.
   */
  api : function(uri, params, options, callback) {
    var info = {
      host: options.apiHost || Junar.apiHost,
      port: 80,
      method: 'GET'
    };

    var reqParams = params || {};

    Object.extend(reqParams, {
      auth_key : options.authKey
    });

    var query = "?";

    for (var paramName in reqParams) {
      query += paramName + "=" + reqParams[paramName] + "&";
    }

    info.path = uri + query;

    http.get(info, function(response) {
      var data = "";

      response.on("data", function(chunk) {
        data += chunk;
      }).on("end", function() {
        var info = JSON.parse(data);
        var argument = Junar.Argument.build(info.result);

        info.result = argument;
        callback(info);
      });
    }).on('error', function(e) {
      console.log('Error: ' + e.message);
    });
  },

  /** Constructs a Junar object. This object uses an existing API key to
   * perform requests against the Junar API via HTTP.
   *
   * @param {Object} options Options to configure the Junar object.
   *  Cannot be null.
   * @param {String} authKey Key used to perform requests against the API.
   *    Cannot be null or empty.
   * @param {String} [apiHost] Alternative address to access the Junar
   *    API. By default Junar.apiHost is used.
   * @constructor
   */
  create : function(options) {
    var api = this.api;

    var get = function(uri, params, callback) {
      api(uri, params, options, callback);
    };

    return new Junar({
      get : get
    });
  }
});

Junar.Argument = Class.create({
  /** Abstract Argument type.
   * @constant
   */
  type : null,

  /** Data stored in this argument.
   * @type Object
   */
  data : null,

  /** This constructor must not be used.
   */
  initialize : function() {
    throw new Error("Cannot be instantiated.");
  },

  /** Returns the raw data stored in this Argument.
   *
   * @return {Object} The raw value. Never returns null.
   */
  getValue : function(row, column) {
    return this.data;
  },
});

Object.extend(Junar.Argument, {
  /** Creates a new concrete Argument depending on the type of the
   * specified raw argument.
   *
   * @param {Object} argument Raw argument. Cannot be null.
   * @return {Junar.Argument} The concrete argument. Never returns null.
   * @throws Throws an error if the type isn't recognized.
   */
  build : function(argument) {
    var type = argument.fType.toLowerCase();
    type = type.substr(0, 1).toUpperCase() + type.substr(1);
    var klass = Junar[type + "Argument"];

    if (!klass) {
      throw new Error("Type isn't recognized: " + argument.fType);
    }

    return new klass(argument);
  }
});

Junar.TextArgument = Class.create(Junar.Argument, {
  /** Text Argument type.
   * @constant
   */
  type : "TEXT",

  /** Constructs a new TextArgument.
   *
   * @param {Object} data Object that contains the String data. Cannot be
   *    null.
   */
  initialize : function(data) {
    this.data = data.fStr;
  },

  /** Returns the String representation of this argument.
   * @return {String} A valid String. Never returns null.
   */
  toString : function() {
    return this.getValue();
  }
});

Junar.NumberArgument = Class.create(Junar.Argument, {
  /** Number Argument type.
   * @constant
   */
  type : "NUMBER",

  /** Constructs a new NumberArgument.
   *
   * @param {Object} data Object that contains the Number data. Cannot be
   *    null.
   */
  initialize : function(data) {
    this.data = data.fNum;
  },

  /** Returns the String representation of this argument.
   * @return {String} A valid String. Never returns null.
   */
  toString : function() {
    return this.getValue();
  }
});

Junar.LinkArgument = Class.create(Junar.Argument, {
  /** Link Argument type.
   * @constant
   */
  type : "LINK",

  /** Constructs a new LinkArgument.
   *
   * @param {Object} data Object that contains the Link data. Cannot be
   *    null.
   */
  initialize : function(data) {
    this.data = data.fUri;
  },

  /** Returns the String representation of this argument.
   * @return {String} A valid String. Never returns null.
   */
  toString : function() {
    return this.getValue();
  }
});

Junar.ErrorArgument = Class.create(Junar.Argument, {
  /** Error Argument type.
   * @constant
   */
  type : "ERROR",

  /** Constructs a new ErrorArgument.
   *
   * @param {Object} data Object that contains the Error data. Cannot be
   *    null.
   */
  initialize : function(data) {
    this.data = data.fStr;
  },

  /** Returns the String representation of this argument.
   * @return {String} A valid String. Never returns null.
   */
  toString : function() {
    return this.getValue();
  }
});

Junar.ArrayArgument = Class.create(Junar.Argument, {
  /** Array Argument type.
   * @constant
   */
  type : "ARRAY",

  /** Number of rows.
   * @type Number
   */
  rows : null,

  /** Number of columns.
   * @type Number
   */
  cols : null,

  /** Number of cells in the table.
   * @type Number
   */
  size : null,

  /** Constructs a new ArrayArgument.
   *
   * @param {Object} data Object that contains the array data. Cannot be
   *    null.
   */
  initialize : function(data) {
    this.data = data.fArray;
    this.rows = data.fRows;
    this.cols = data.fCols;
    this.size = data.fRows * data.fCols;
  },

  /** Returns the value of the specified cell.
   *
   * @param {Number} row Row number. Must be greater than 0.
   * @param {Number} column Column number. Must be greater than 0.
   *
   * @return {String} The cell value, or null if the cell doesn't exist.
   */
  getValue : function(row, column) {
    var offset = ((row - 1) * this.cols) + column - 1;
    if (offset > this.size) {
      return null;
    }
    return Junar.Argument.build(this.data[offset]);
  }
});

