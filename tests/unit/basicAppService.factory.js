describe( 'Service: BasicAppService', function () {
	var service;

	var mockInterval;
	var mockRootScope;
	var mockWindow;

	var BasicAppEvent;

	beforeEach( function () {
		module( 'angular.basicAppService' );
	} );

	beforeEach( inject( function ( _$interval_, _$rootScope_, _$window_, _BasicAppEvent_, _BasicAppService_ ) {
		mockInterval = _$interval_;
		mockRootScope = _$rootScope_;
		mockWindow = _$window_;

		service = _BasicAppService_;
		BasicAppEvent = _BasicAppEvent_;

	} ) );

	it( 'should broadcast BasicAppEvent.APP_ORIENTATION_CHANGED on orientationchange', function () {

		// given
		spyOn( mockRootScope, '$broadcast' );

		var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
		orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

		mockWindow.innerHeight = 500;
		mockWindow.innerWidth = 1000;

		// make sure we are in landscape first

		mockWindow.dispatchEvent( orientationChangeEvent );

		// then prepare to change to portrait
		mockRootScope.$broadcast.calls.reset();
		mockWindow.innerHeight = 1000;
		mockWindow.innerWidth = 500;


		//when
		mockWindow.dispatchEvent( orientationChangeEvent );

		//then
		expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_ORIENTATION_CHANGED, 'appOrientation_portrait' ] );

	} );

	it( 'should broadcast BasicAppEvent.APP_SIZE_CHANGED on resize', function () {

		// given
		spyOn( mockRootScope, '$broadcast' );

		var resizeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
		resizeEvent.initCustomEvent( 'resize', false, false, null );

		//when
		mockWindow.dispatchEvent( resizeEvent );

		//then
		expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_SIZE_CHANGED, jasmine.any( Object ) ] );

	} );

	it( 'should broadcast BasicAppEvent.APP_SCROLL_POSITION_CHANGED on scroll', function () {

		// given
		spyOn( mockRootScope, '$broadcast' );

		var scrollEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
		scrollEvent.initCustomEvent( 'scroll', false, false, null );

		//when
		mockWindow.dispatchEvent( scrollEvent );
		mockInterval.flush( 100 );

		//then
		expect( mockRootScope.$broadcast ).toHaveBeenCalledWith( BasicAppEvent.APP_SCROLL_POSITION_CHANGED, jasmine.any( Object ) );

	} );
} );