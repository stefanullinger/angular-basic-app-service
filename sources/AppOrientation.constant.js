(function () {

	angular
		.module( 'angular.basicAppService' )
		.constant( 'AppOrientation', {
			LANDSCAPE: 'appOrientation_landscape',
			PORTRAIT:  'appOrientation_portrait'
		} );

})();