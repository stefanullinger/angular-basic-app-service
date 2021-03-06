(function () {

	angular
		.module( 'angular.basicAppService' )
		.factory( 'BasicAppService', serviceDefinition );

	serviceDefinition.$inject = [ '$document', '$interval', '$rootScope', '$window', 'AppOrientation', 'BasicAppEvent' ];

	function serviceDefinition( $document, $interval, $rootScope, $window, AppOrientation, BasicAppEvent ) {
		// ********
		// Private
		// ********
		var service = this;

		service.appOrientation = null;
		service.appSize = {
			height: $window.innerHeight,
			width:  $window.innerWidth
		};
		service.fixedElementSelectors = [];
		service.scrollPosition = {
			left: $document[0].body.scrollLeft,
			top:  $document[0].body.scrollTop
		};
		service.scrollOffset = {
			left: 0,
			top:  0
		};


		// ********
		// Public
		// ********
		var serviceInterface = {
			getAppOrientation: getAppOrientation,
			getAppSize:        getAppSize,
			getScrollPosition: getScrollPosition,
			getScrollOffset:   getScrollOffset,
			setScrollOffset:   setScrollOffset
		};


		// ****************
		// Initialization
		// ****************
		angular.element( $window ).on( 'orientationchange', onResizeOrOrientationChange );
		angular.element( $window ).on( 'resize', onResizeOrOrientationChange );
		angular.element( $window ).on( 'scroll', onScrollPositionChanged );

		startPollingForScrollPositionChanged();

		// trigger initial update
		onResizeOrOrientationChange();
		onScrollPositionChanged();

		return serviceInterface;


		// ****************
		// Implementation
		// ****************
		function getAppOrientation() {
			return service.appOrientation;
		}

		function getAppSize() {
			return service.appSize;
		}

		function getScrollOffset() {
			return service.scrollOffset;
		}

		function getScrollPosition() {
			return service.scrollPosition;
		}

		function onResizeOrOrientationChange() {
			updateAppOrientation();
			updateAppSize();
		}

		function onScrollPositionChanged() {
			service.didScroll = true;
		}

		function setScrollOffset( left, top ) {
			service.scrollOffset = {
				left: left,
				top:  top
			}
		}

		function startPollingForScrollPositionChanged() {
			$interval( function () {
				if ( service.didScroll ) {
					service.scrollPosition = {
						left: $document[0].body.scrollLeft + service.scrollOffset.left,
						top:  $document[0].body.scrollTop + service.scrollOffset.top
					};

					$rootScope.$broadcast( BasicAppEvent.APP_SCROLL_POSITION_CHANGED, service.scrollPosition );
					service.didScroll = false;
				}
			}, 100 );
		}

		function updateAppOrientation() {
			var previousAppOrientation = service.appOrientation;
			service.appOrientation = $window.innerWidth > $window.innerHeight ? AppOrientation.LANDSCAPE : AppOrientation.PORTRAIT;

			if ( previousAppOrientation != service.appOrientation ) {
				$rootScope.$broadcast( BasicAppEvent.APP_ORIENTATION_CHANGED, service.appOrientation );
			}
		}

		function updateAppSize() {
			var previousAppSize = angular.extend( {}, service.appSize );

			service.appSize.height = $window.innerHeight;
			service.appSize.width = $window.innerWidth;

			$rootScope.$broadcast( BasicAppEvent.APP_SIZE_CHANGED, {
				from: previousAppSize,
				to:   service.appSize
			} );
		}
	}

})();