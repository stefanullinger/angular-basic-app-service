module.exports = function ( config ) {
	var configuration = {

		basePath: './',

		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'sources/**/*.module.js',
			'sources/**/*',
			'tests/unit/**/*.js'
		],

		autoWatch: true,

		frameworks: [ 'jasmine' ],

		browsers: [ 'Chrome' ],

		plugins: [
			'karma-chrome-launcher',
			'karma-coverage',
			'karma-firefox-launcher',
			'karma-jasmine',
			'karma-phantomjs-launcher'
		],

		reporters: [ 'progress', 'coverage' ],

		preprocessors: {
			'sources/**/*.js': [ 'coverage' ]
		},

		coverageReporter: {
			type:   'lcovonly',
			dir:    'coverage/',
			subdir: '.'
		},

		customLaunchers: {
			Chrome_travis_ci: {
				base:  'Chrome',
				flags: [ '--no-sandbox' ]
			}
		}

	};

	if ( process.env.TRAVIS ) {
		configuration.browsers = [ 'Chrome_travis_ci' ];
	}

	config.set(configuration);
};