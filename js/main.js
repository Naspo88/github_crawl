(function () {
	var app = angular.module("gitCrawl", []);

	/* CONTROLLERS */
	app.controller("SearchUser", function ($scope) {

		/* Scope init */
		$scope.search = "";
		$scope.var = {
			currPage: 1,
			elForPage: 5,
			nPages: [1],
			text: "",
			user: {},
			repos: {},
			have_user: null,
			have_repo: null,
			exceed: false
		};
	

		$scope.searchTxt = function () {
			$scope.var.currPage = 1;
			$scope.search = "";

			ajaxCall.getUser($scope.var.text, function (data) {

				if (!data.exceed) {
					$scope.var.user = data;
					$scope.var.have_user = !$.isEmptyObject(data);
					$scope.var.text = "";
					$('#customer').blur();

					if (data.repositories > 0) {
						ajaxCall.getRepos(data.repos_url, function (repos) {
							console.log(repos);
							$scope.var.have_repo = true;
							$scope.var.repos = repos;

							$scope.$apply();
						});
					} else {
						$scope.var.have_repo = false;

						$scope.$apply();
					}
				} else {
					$scope.var.text = "";
					$scope.var.have_user = false;
					$scope.var.exceed = true;
				}

			});
		};

		$scope.$watch('search', function () {
			var len = global_fn.getFilterLength($scope.var.repos, $scope.search);
			$scope.var.nPages = global_fn.getPages(len, $scope.var.elForPage);
		});
	});

	/* DIRECTIVES */
	app.directive("repoElem", function () {
		return {
			restrict: "E",
			templateUrl: "html/repository_elem.html"
			// controller: function ($scope) {
			// }
		}
	});

	/* FILTERS */
	app.filter('startFrom', function() {
	    return function(input, start) {
	    	if (!$.isEmptyObject(input)) {
	    		start = +start; //parse to int
	        	return input.slice(start);
	    	}
	    }
	});
})();
