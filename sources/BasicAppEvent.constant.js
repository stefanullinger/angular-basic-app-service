(function () {

	angular
		.module( 'angular.basicAppService' )
		.constant( 'BasicAppEvent', {
			APP_SIZE_CHANGED:            'basicAppEvent_appSizeChanged',
			APP_ORIENTATION_CHANGED:     'basicAppEvent_appOrientationChanged',
			APP_SCROLL_POSITION_CHANGED: 'basicAppEvent_appScrollPosition'
		} );

})();