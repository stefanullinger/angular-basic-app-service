describe( "Service: BasicAppService", function () {
	var service;

	var mockInterval;
	var mockRootScope;
	var mockWindow;

	var AppOrientation;
	var BasicAppEvent;

	beforeEach( function () {
		module( 'angular.basicAppService' );
	} );

	beforeEach( inject( function ( _$interval_, _$rootScope_, _$window_, _AppOrientation_, _BasicAppEvent_, _BasicAppService_ ) {
		mockInterval = _$interval_;
		mockRootScope = _$rootScope_;
		mockWindow = _$window_;

		service = _BasicAppService_;
		AppOrientation = _AppOrientation_;
		BasicAppEvent = _BasicAppEvent_;
	} ) );

	it( "should broadcast BasicAppEvent.APP_ORIENTATION_CHANGED on orientationchange", function () {

		// *******
		// given
		// *******
		spyOn( mockRootScope, '$broadcast' );

		var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
		orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

		// make sure we are in landscape first
		mockWindow.innerHeight = 500;
		mockWindow.innerWidth = 1000;
		mockWindow.dispatchEvent( orientationChangeEvent );

		// then prepare to change to portrait
		mockRootScope.$broadcast.calls.reset();
		mockWindow.innerHeight = 1000;
		mockWindow.innerWidth = 500;

		// ******
		// when
		// ******
		mockWindow.dispatchEvent( orientationChangeEvent );

		// ******
		// then
		// ******
		expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_ORIENTATION_CHANGED, AppOrientation.PORTRAIT ] );

	} );

	it( "should broadcast BasicAppEvent.APP_SIZE_CHANGED on resize", function () {

		// *******
		// given
		// *******
		spyOn( mockRootScope, '$broadcast' );

		var resizeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
		resizeEvent.initCustomEvent( 'resize', false, false, null );

		// ******
		// when
		// ******
		mockWindow.dispatchEvent( resizeEvent );

		// ******
		// then
		// ******
		expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_SIZE_CHANGED, jasmine.any( Object ) ] );

	} );

	it( "should broadcast BasicAppEvent.APP_SCROLL_POSITION_CHANGED on scroll", function () {

		// *******
		// given
		// *******
		spyOn( mockRootScope, '$broadcast' );

		var scrollEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
		scrollEvent.initCustomEvent( 'scroll', false, false, null );

		// ******
		// when
		// ******
		mockWindow.dispatchEvent( scrollEvent );
		mockInterval.flush( 100 );

		// ******
		// then
		// ******
		expect( mockRootScope.$broadcast ).toHaveBeenCalledWith( BasicAppEvent.APP_SCROLL_POSITION_CHANGED, jasmine.any( Object ) );

	} );

	describe( "Method: getAppOrientation", function () {
		it( "should return AppOrientation.LANDSCAPE when the window's width is greater than its height", function () {

			// *******
			// given
			// *******
			var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

			mockWindow.innerHeight = 500;
			mockWindow.innerWidth = 1000;

			mockWindow.dispatchEvent( orientationChangeEvent );

			// ******
			// when
			// ******
			var result = service.getAppOrientation();

			// ******
			// then
			// ******
			expect( result ).toBe( AppOrientation.LANDSCAPE );

		} );

		it( "should return AppOrientation.PORTRAIT when the window's width is lower than its height", function () {

			// *******
			// given
			// *******
			var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

			mockWindow.innerHeight = 1000;
			mockWindow.innerWidth = 500;

			mockWindow.dispatchEvent( orientationChangeEvent );

			// ******
			// when
			// ******
			var result = service.getAppOrientation();

			// ******
			// then
			// ******
			expect( result ).toBe( AppOrientation.PORTRAIT );

		} );
	} );

	describe( "Method: getAppSize", function () {
		it( "should return an object containing the current width and height of the application", function () {

			// *******
			// given
			// *******
			var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

			var expectedHeight = 123;
			var expectedWidth = 456;

			mockWindow.innerHeight = expectedHeight;
			mockWindow.innerWidth = expectedWidth;

			mockWindow.dispatchEvent( orientationChangeEvent );

			// ******
			// when
			// ******
			var result = service.getAppSize();

			// ******
			// then
			// ******
			expect( result ).toEqual( { height: expectedHeight, width: expectedWidth } );

		} );
	} );

	describe( "Method: getScrollPosition", function () {
		it( "should return an object containing the current left and top scroll position of the application", function () {

			// *******
			// given
			// *******
			var scrollEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			scrollEvent.initCustomEvent( 'scroll', false, false, null );

			var expectedLeft = 123;
			var expectedTop = 456;

			mockWindow.document.body.style.minHeight = '9000px';
			mockWindow.document.body.style.minWidth = '9000px';
			mockWindow.scrollTo( expectedLeft, expectedTop );
			mockWindow.dispatchEvent( scrollEvent );
			mockInterval.flush( 100 );

			// ******
			// when
			// ******
			var result = service.getScrollPosition();

			// ******
			// then
			// ******
			expect( result ).toEqual( { left: expectedLeft, top: expectedTop } );

		} );
	} );

	describe( "Method: setScrollOffset", function () {
		it( "should set the offset that gets added to the current scroll position", function () {

			// *******
			// given
			// *******
			var scrollEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			scrollEvent.initCustomEvent( 'scroll', false, false, null );

			var scrollLeft = 123;
			var scrollTop = 456;

			var scrollOffsetLeft = 789;
			var scrollOffsetTop = 312;


			var expectedLeft = scrollLeft + scrollOffsetLeft;
			var expectedTop = scrollTop + scrollOffsetTop;

			service.setScrollOffset( scrollOffsetLeft, scrollOffsetTop );

			mockWindow.document.body.style.minHeight = '9000px';
			mockWindow.document.body.style.minWidth = '9000px';
			mockWindow.scrollTo( scrollLeft, scrollTop );
			mockWindow.dispatchEvent( scrollEvent );
			mockInterval.flush( 100 );

			// ******
			// when
			// ******
			var result = service.getScrollPosition();

			// ******
			// then
			// ******
			expect( result ).toEqual( { left: expectedLeft, top: expectedTop } );

		} );
	} );

	describe( "Method: getScrollOffset", function () {
		it( "should get the previously set scroll offset", function () {

			// *******
			// given
			// *******
			var expectedLeft = 123;
			var expectedTop = 456;

			service.setScrollOffset( expectedLeft, expectedTop );

			// ******
			// when
			// ******
			var result = service.getScrollOffset();

			// ******
			// then
			// ******
			expect( result ).toEqual( { left: expectedLeft, top: expectedTop } );

		} );
	} );

	describe( "Event: BasicAppEvent.APP_ORIENTATION_CHANGED", function () {
		it( "should carry AppOrientation.LANDSCAPE when the window's width is greater than its height", function () {

			// *******
			// given
			// *******
			spyOn( mockRootScope, '$broadcast' );

			var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

			// make sure we are in portrait first
			mockWindow.innerHeight = 1000;
			mockWindow.innerWidth = 500;
			mockWindow.dispatchEvent( orientationChangeEvent );

			// then prepare to change to landscape
			mockRootScope.$broadcast.calls.reset();
			mockWindow.innerHeight = 500;
			mockWindow.innerWidth = 1000;

			// ******
			// when
			// ******
			mockWindow.dispatchEvent( orientationChangeEvent );

			// ******
			// then
			// ******
			expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_ORIENTATION_CHANGED, AppOrientation.LANDSCAPE ] );

		} );

		it( "should carry AppOrientation.PORTRAIT when the window's width is lower than its height", function () {

			// *******
			// given
			// *******
			spyOn( mockRootScope, '$broadcast' );

			var orientationChangeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			orientationChangeEvent.initCustomEvent( 'orientationchange', false, false, null );

			// make sure we are in landscape first
			mockWindow.innerHeight = 500;
			mockWindow.innerWidth = 1000;
			mockWindow.dispatchEvent( orientationChangeEvent );

			// then prepare to change to portrait
			mockRootScope.$broadcast.calls.reset();
			mockWindow.innerHeight = 1000;
			mockWindow.innerWidth = 500;

			// ******
			// when
			// ******
			mockWindow.dispatchEvent( orientationChangeEvent );

			// ******
			// then
			// ******
			expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_ORIENTATION_CHANGED, AppOrientation.PORTRAIT ] );

		} );
	} );

	describe( "Event: BasicAppEvent.APP_SIZE_CHANGED", function () {
		it( "should carry an object containing the previous and the new app dimensions", function () {

			// *******
			// given
			// *******
			spyOn( mockRootScope, '$broadcast' );

			var resizeEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			resizeEvent.initCustomEvent( 'resize', false, false, null );

			var expectedOldHeight = mockWindow.innerHeight;
			var expectedOldWidth = mockWindow.innerWidth;

			var expectedNewHeight = 1230;
			var expectedNewWidth = 4560;

			var expectedObject = {
				from: {
					height: expectedOldHeight,
					width: expectedOldWidth
				},
				to: {
					height: expectedNewHeight,
					width: expectedNewWidth
				}
			};

			mockWindow.innerHeight = expectedNewHeight;
			mockWindow.innerWidth = expectedNewWidth;

			// ******
			// when
			// ******
			mockWindow.dispatchEvent( resizeEvent );

			// ******
			// then
			// ******
			expect( mockRootScope.$broadcast.calls.allArgs() ).toContain( [ BasicAppEvent.APP_SIZE_CHANGED, expectedObject ] );

		} );
	} );

	describe( "Event: BasicAppEvent.APP_SCROLL_POSITION_CHANGED", function () {
		it( "should carry an object containing the current scroll position including the scroll offset", function () {

			// *******
			// given
			// *******
			spyOn( mockRootScope, '$broadcast' );

			var scrollEvent = document.createEvent( 'CustomEvent' ); // MUST be 'CustomEvent'
			scrollEvent.initCustomEvent( 'scroll', false, false, null );

			var scrollLeft = 123;
			var scrollTop = 456;

			var scrollOffsetLeft = 789;
			var scrollOffsetTop = 312;


			var expectedLeft = scrollLeft + scrollOffsetLeft;
			var expectedTop = scrollTop + scrollOffsetTop;

			service.setScrollOffset( scrollOffsetLeft, scrollOffsetTop );

			mockWindow.document.body.style.minHeight = '9000px';
			mockWindow.document.body.style.minWidth = '9000px';
			mockWindow.scrollTo( scrollLeft, scrollTop );
			mockWindow.dispatchEvent( scrollEvent );
			mockInterval.flush( 100 );

			// ******
			// when
			// ******
			var result = service.getScrollPosition();

			// ******
			// then
			// ******
			expect( mockRootScope.$broadcast ).toHaveBeenCalledWith( BasicAppEvent.APP_SCROLL_POSITION_CHANGED, { left: expectedLeft, top: expectedTop } );

		} );
	} );
} );