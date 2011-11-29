# Junar SDK #
Unofficial SDK implementation for the Junar.com API, a service to collect,
organize, use and share data.

## Installation ##
You can install via npm:

    $ npm install express

or just cloning the repository and putting the sources under the node_modules
folder in your project:

    $ cd node_modules
    $ git clone git://github.com/seykron/junar-javascript-sdk.git

## Usage ##

Adding Junar to the application:
    var Junar = export("junar").create({
      authKey : "[your-junar-api-key]"
    });

Reading data streams:
    Junar.stream("LATES-7-AROUN-THE-WORLD", [], function(response) {
      var region = response.result.getValue(2, 7).getValue();
      var magnitude = response.result.getValue(2, 2);

      console.log("Last earthquake ocurred in " + region +
        " with a magnitude of " + magnitude);
    });

