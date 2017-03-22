var s_url = "https://api.github.com/";
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
			fn.fail();
			console.log(resp.responseJSON.message);
		});
	},

	getUser: function (user, cb) {
		var datas = {
			method: "GET",
			url: s_url + "users/" + user
		};
		var fn = {
			done: function (data) {
				cb(data);
			},
			fail: function () {
				cb({});
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
				cb(data);
			},
			fail: function () {
				cb({});
			}
		};

		this.call(datas, fn);

	}
};