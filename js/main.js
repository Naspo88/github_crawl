(function () {
	var app = angular.module("gitCrawl", []);

	/* CONTROLLERS */
	app.controller("SearchUser", function ($scope, $filter) {

		$scope.var = {
			currPage: 1,
			elForPage: 5,
			nPages: [1],
			text: "",
			user: {},
			repos: {},
			have_user: null,
			have_repo: null
		};

		$scope.search = function () {
			$scope.var.currPage = 1;
			ajaxCall.getUser($scope.var.text, function (data) {
				console.log(data);
				$scope.var.user = data;
				$scope.var.have_user = !$.isEmptyObject(data);

				if ($scope.var.user.public_repos > 0) {
					ajaxCall.getRepos(data.repos_url, function (repos) {
						console.log(repos);
						$scope.var.have_repo = true;
						$scope.var.repos = repos;
						$scope.var.text = "";
						$scope.var.nPages = (function () {
							var ret = [];
							var n = Math.ceil($scope.var.repos.length/$scope.var.elForPage);
							for (var i = 1; i <= n; i++) {
								ret.push(i);
							}

							return ret;
						})();

						$scope.$apply();
					});
				} else {
					$scope.var.have_repo = false;

					$scope.$apply();
				}

				
			});
		};
	});

	/* DIRECTIVES */
	app.directive("repoElem", function () {
		return {
			restrict: "E",
			templateUrl: "html/repository_elem.html",
			controller: function ($scope) {

				$scope.format = function (date) {
					var d = new Date (date);
					var day = d.getDate();
					var monthIndex = d.getMonth();
					var year = d.getFullYear();

					return monthNames[monthIndex] + ' ' + day + ', ' + year;
				};

			}
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
