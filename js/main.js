(function () {
	var app = angular.module("gitCrawl", []);

	app.controller("SearchUser", function ($scope) {

		$scope.var = {
			text: "",
			user: {},
			repos: {},
			have_user: null
		};

		$scope.search = function () {
			ajaxCall.getUser($scope.var.text, function (data) {
				console.log(data);
				$scope.var.user = data;

				ajaxCall.getRepos(data.repos_url, function (repos) {
					console.log(repos);
					$scope.var.repos = repos;
					$scope.var.text = "";
					$scope.var.have_user = !$.isEmptyObject(data);

					$scope.$apply();
				});
			});
		};
	});

	app.directive("repoElem", function () {
		return {
			restrict: "E",
			templateUrl: "html/repository_elem.html"
			// controller: function ($scope) {
			// 	//
			// }
		}
	});
})();
