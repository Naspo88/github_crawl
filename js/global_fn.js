var s_url = "https://api.github.com/";
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var orderingTypes = [
	{
		prop: "name",
		label: "Repository Name"
	}, 
	{
		prop: "id",
		label: "Repository Id"
	},
	{
		prop: "created_at",
		label: "Cration Date"
	},
	{
		prop: "language",
		label: "Main Language"
	},
	{
		prop: "forks",
		label: "Number of forks"
	},
	{
		prop: "stars",
		label: "Number of stars"
	},
	{
		prop: "open_issues",
		label: "Open Issues"
	}
];
var boolSelectOpt = [{ lab: 'DESC', val: true }, { lab: 'ASC', val: false }];
var jsonCleaner = {
	user: function (data) {
		var user = {
			name: data.name || "Unknown",
			login: data.login,
			location: data.location || "Unknown",
			followers: data.followers,
			following: data.following,
			repositories: data.public_repos,
			avatar: data.avatar_url,
			link: data.html_url,
			repos_url: data.repos_url
		};

		return user;
	},
	repos: function (data) {
		var repos = [];

		$.each(data, function (id, val) {
			var elem = {
				link: val.html_url,
				name: val.name,
				id: val.id,
				created_at: val.created_at,
				date: global_fn.formatDate(val.created_at),
				forks: val.forks,
				stars: val.watchers,
				language: val.language || "Unknown",
				has_issues: val.has_issues,
				open_issues: val.open_issues,
				desc: val.description || "No description"
			};

			repos.push(elem);
		});

		return repos;
	}
};
var ajaxCall = {
	call: function (datas, fn) {
		"use strict";

		var req = $.extend({
			cache: true
		}, datas);

		var call = $.ajax(req);

		call.done(function(resp) {
			fn.done(resp);
		});

		call.fail(function(resp) {
			var is_exceed = (resp.status == 403);
			fn.fail(is_exceed);
		});
	},

	getUser: function (user, cb) {
		var datas = {
			method: "GET",
			url: s_url + "users/" + user
		};
		var fn = {
			done: function (data) {
				cb(jsonCleaner.user(data));
			},
			fail: function (exceed) {
				var failObj = {};
				if (exceed)
					failObj.exceed = true;
				cb(failObj);
			}
		};

		this.call(datas, fn);
	},

	getRepos: function (url, cb) {
		var datas = {
			method: "GET",
			url: url
		};
		var fn = {
			done: function (data) {
				cb(jsonCleaner.repos(data));
			},
			fail: function () {
				cb({});
			}
		};

		this.call(datas, fn);

	}
};
var global_fn = {

	getPages: function (len, elForPage) {
		var ret = [];

		var n = Math.ceil(len/elForPage);
		for (var i = 1; i <= n; i++) {
			ret.push(i);
		}

		return ret;
	},

	formatDate: function (date) {
		var d = new Date (date);
		var day = d.getDate();
		var monthIndex = d.getMonth();
		var year = d.getFullYear();

		return monthNames[monthIndex] + ' ' + day + ', ' + year;
	},

	getFilterLength: function (array, filter, prop) {
		prop = prop || "name";
		var c = 0;

		$.each(array, function (i, val) {
			if (val[prop].indexOf(filter) >= 0)
				c++;
		});

		return c;
	}

}