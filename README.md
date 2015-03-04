[![Bower version](https://badge.fury.io/bo/angular-basic-app-service.svg)](http://badge.fury.io/bo/angular-basic-app-service) [![Build Status](https://travis-ci.org/sullinger/angular-basic-app-service.svg?branch=master)](https://travis-ci.org/sullinger/angular-basic-app-service) [![Coverage Status](https://coveralls.io/repos/sullinger/angular-basic-app-service/badge.svg?branch=master)](https://coveralls.io/r/sullinger/angular-basic-app-service?branch=master)  
[![Hire SliceMeNice](https://img.shields.io/badge/Need%20Support%3F-Hire%20SliceMeNice-red.svg)](http://www.slicemenice.de)
# angular-basic-app-service

Basic app service you can extend, that contains code to handle common events like resize, orientationchange, onscroll and much more.


## How to install

```
bower install angular-basic-app-service --save
```


## How to use

Reference the module in your app.

```javascript
(function() {

  angular
    .module( 'someApp', [
      'angular.basicAppService'
    ] );

})();
```

Create your AppService by extending the BasicAppService

```javascript
(function() {

  angular
    .module( 'someApp' )
    .factory( 'AppService', serviceDefinition );

  serviceDefinition.$inject = [ 'BasicAppService' ];

  function serviceDefinition( BasicAppService ) {
    var service = angular.copy( BasicAppService );

    service.someOtherMethod = function() {
      // your code
    };

    return service;
  }

})();
```


## Release History

__1.0.0__

  * First stable release of angular-basic-app-service.
