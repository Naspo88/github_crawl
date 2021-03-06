(function () {
	var app = angular.module("gitCrawl", []);

	/* CONTROLLERS */
	app.controller("SearchUser", function ($scope) {

		/* Scope init */
		$scope.orderingTypes = orderingTypes;
		$scope.dirOption = boolSelectOpt;
		$scope.var = {
			currPage: 1,
			elForPage: 5,
			nPages: [1],
			text: "",
			user: {},
			repos: [],
			has_user: null,
			has_repo: null,
			exceed: false,
			search: "",
			sortBy: "name",
			sortAsc: false
		};
	

		$scope.searchTxt = function () {
			$scope.var.currPage = 1;
			$scope.var.search = "";
			$scope.var.sortBy = "name";
			$scope.var.sortAsc = false;

			ajaxCall.getUser($scope.var.text, function (data) {

				if (!data.exceed) {
					$scope.var.user = data;
					$scope.var.has_user = !$.isEmptyObject(data);
					$scope.var.text = "";
					$('#customer').blur();

					if (data.repositories > 0) {
						ajaxCall.getRepos(data.repos_url, function (repos) {
							console.log(repos);
							$scope.var.has_repo = true;
							$scope.var.repos = repos;
							$scope.var.nPages = global_fn.getPages($scope.var.repos.length, $scope.var.elForPage);
							
							$scope.$apply();
						});
					} else {
						$scope.var.has_repo = false;

						$scope.$apply();
					}
				} else {
					$scope.var.text = "";
					$scope.var.has_user = false;
					$scope.var.exceed = true;
				}

			});
		};

		$scope.$watch('var.search', function () {
			$scope.var.currPage = 1;
			var len = global_fn.getFilterLength($scope.var.repos, $scope.var.search);
			$scope.var.nPages = global_fn.getPages(len, $scope.var.elForPage);
		});
	});

	/* DIRECTIVES */
	app.directive("repoElem", function () {
		return {
			restrict: "E",
			templateUrl: "html/repository_elem.html"
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
