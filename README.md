# Junar SDK #
Unofficial SDK implementation for the Junar.com API, a service to collect,
organize, use and share data.

## Installation ##
You can install via npm:

    $ npm install junar

or just cloning the repository and putting the sources under the node_modules
folder in your project:

    $ cd node_modules
    $ git clone git://github.com/seykron/junar-javascript-sdk.git

## Usage ##

Adding Junar to the application:

    var Junar = require("junar").create({
      authKey : "[your-junar-api-key]"
    });

Reading data streams:

    Junar.stream("LATES-7-AROUN-THE-WORLD", [], function(response) {
      var table = response.result;
      var region = table.result.getValue(2, 7).getValue();
      var magnitude = table.getValue(2, 2);

      console.log("Last earthquake ocurred in " + region +
        " with a magnitude of " + magnitude);
    });

## License ##
(Released under MIT License since v0.0.1)

Copyright (c) 2011 Matías MI  <matias.mi@riseup.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
