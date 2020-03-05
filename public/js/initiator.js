function Util() {
}

Util.uuid = function (len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data. At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
}

Util.isEmpty = function (t) {
	if (t === undefined || t === null || t === "") {
		return true;
	}
	if (Array.isArray(t) && t.length == 0) {
		return true;
	}
	if (t instanceof Object && Object.keys(t).length == 0) {
		return true;
	}
	return false;
}

Util.clone = function (target) {
	try {
		return JSON.parse(JSON.stringify(target));
	} catch (error) {
		console.error(err);
		return target;
	}
}

Util.copyProps = function (target, source) {
	try {
		for (var key in target) {
			target[key] = source[key];
		}
		return target;
	} catch (error) {
		console.error(err);
		return target;
	}
}

if (!!$) {
	$.old = {}
	$.old.get = $.get;
	$.old.post = $.post;
	$.get = function () {
		var params, callback;
		[...params] = arguments
		if (params.length == 0) return;
		callback = params.pop();
		if (typeof callback == "function") {
			params.push(function () {
				var returnObj = arguments[0] || {};
				if (returnObj.status == "fail") {
					$.ic.loadUI.hide();
					alert(returnObj.data.errMsg);
				}
				if (arguments[1] != "success") {
					$.ic.loadUI.hide();
					alert("网络繁忙");
				}
				callback.apply(this, arguments);
			});
		} else {
			params.push(callback);
		}
		$.old.get.apply(this, params);
	}
	$.post = function () {
		var params, callback;
		[...params] = arguments
		if (params.length == 0) return;
		callback = params.pop();
		if (typeof callback == "function") {
			params.push(function () {
				var returnObj = arguments[0] || {};
				if (returnObj.status == "fail") {
					$.ic.loadUI.hide();
					alert(returnObj.data.errMsg);
				}
				if (arguments[1] != "success") {
					$.ic.loadUI.hide();
					alert("网络繁忙");
				}
				callback.apply(this, arguments);
			});
		} else {
			params.push(callback);
		}
		$.old.post.apply(this, params);
	}

	var LoadUI = function (target) {
		var that = this;
		this.target = target ? target : window.top;
		this.loader = $("<div class='custom-LoadUI'><i class='el-icon-loading'></div>");
		this.loader.width(this.target.innerWidth);
		this.loader.height(this.target.innerHeight);
		window.addEventListener("onunload", function () {
			that.target.$('.custom-LoadUI').remove();
		});
	}

	LoadUI.prototype = {
		show: function () {
			var that = this;
			setTimeout(()=> {
				$(this.target.document.body).append(this.loader);
			}, 0);
		},
		hide: function () {
			setTimeout(()=> {
				this.loader.remove();
			}, 0);
		}
	}

	var Dialog = function (options = {}) {
		var that = this;
		that.data = options.data || {};
		that.data.global = options.global ? options.global : false;
		that._vue = {}
		var id = that.id = "dialog_" + Util.uuid(16, 52);
		var html = `<div id="${id}" :global="global"> <el-dialog @closed="closedEvnt">`;
		that.data.visible = false;
		that.children = [];
		if (Array.isArray(options.children)) {
			options.children.forEach((child) => {
				child = child || {};
				child.isChild = true;
				that.children.push(new Dialog(child));
			});
			that.children.forEach((child) => {
				html += child.html;
			});
		}
		if (options.isChild) {
			html = html.replace("el-dialog", "el-dialog append-to-body");
		}
		if (options.title) {
			html = html.replace("el-dialog", `el-dialog title="${options.title}"`);
		}
		if (options.width) {
			html = html.replace("el-dialog", `el-dialog width="${options.width}"`);
		}
		if (options.height) {
			html = html.replace("el-dialog", `el-dialog height="${options.height}"`);
		}
		if (options.beforeClose) {
			html = html.replace("el-dialog", `el-dialog :before-close="${options.beforeClose}"`);
		}
		html = html.replace("el-dialog", `el-dialog :visible.sync="visible"`);
		if (options.body) {
			html += options.body;
		}
		that.methods = options.methods || {};
		for (var key in that.methods) {
			that.methods[key] = $.proxy(that.methods[key], that);
		}
		if (Array.isArray(options.buttons)) {
			html += `<span slot="footer" class="dialog-footer">`
			options.buttons.forEach((button, i) => {
				that.methods["fun" + i] = button.event ? $.proxy(button.event, that) : () => {
				};
				if (button.name == "关闭") {
					that.methods.closedEvnt = that.methods["fun" + i];
				}
				html += `<el-button type="${button.type ? button.type : "default"}" @click="fun${i}">${button.name}</el-button>`;
			});
			html += `</span>`
		}
		html += "</el-dialog></div>";
		that.html = html;
		if (!options.isChild) {
			that.target = options.target ? options.target : window.top;
			if (that.target instanceof Window) {
				$(that.target.document.body).append(html);
			} else {
				throw new Error("dialog not sure target");
			}
			that.init();
		}
	}

	Dialog.prototype = {
		init: function () {
			var that = this;
			if (!Vue) {
				return;
			}
			that.children.forEach((child) => {
				child.parent = that;
				child.init();
			});
			var option = {
				el: "#" + that.id,
				data: that.data,
				methods: that.methods
			};
			if (!that.data.global) {
				option.destroyed = that.destroy;
			}
			that._vue = new Vue(option);
			if (that.data.global) {
				globalThis["globalDialog"] || (globalThis["globalDialog"] = {});
				globalThis["globalDialog"][that.data.global] = that._vue;
			}
		},
		show: function () {
			this.data.visible = true;
		},
		hide: function () {
			this.data.visible = false;
		},
		destroy: function () {
			this.data.visible = false;
			$(`#${this.id}`).remove();
		}
	}

	var navList = function (options = {}) {
		var html = `<el-menu>`;
		if (Array.isArray(options.default)) {
			var defaultArr = options.default.reduce((prev, index) => {
				prev = "" + prev;
				if (!prev.startsWith("'")) {
					prev = `'${prev}'`
				}
				return `${prev}, '${index}'`
			});
			defaultArr = "" + defaultArr;
			if (!defaultArr.startsWith("'")) {
				defaultArr = `'${defaultArr}'`
			}
			html = `<el-menu :default-openeds="[${defaultArr}]">`
		}
		var createMenu = function(menuArr, html, index) {
		index = index ? index + "-" : "";
			menuArr.forEach((menu, i) => {
				if (menu.hidden) return;
				if (menu.type == "01") {
					index = index + i;
					html.str += `<el-submenu index="${index}"><template slot="title">${menu.title}</template><el-menu-item-group>`;
					if (Array.isArray(menu.subMenu)) {
						createMenu(menu.subMenu, html, index);
					}
					html.str += "</el-menu-item-group></el-submenu>";
				}
				if (menu.type == "02") {
					html.str += `<el-menu-item menu-tag=true index="${index}${i}" link="${menu.link}">${menu.title}</el-menu-item>`;
				}
			});
		}
		var obj = {str: ""}
		if (Array.isArray(options.data)) {
			createMenu(options.data, obj);
			// options.data.forEach((menu, i) => {
			// 	html += `<el-submenu index="${i}"><template slot="title">${menu.title}</template><el-menu-item-group>`;
			// 	if (Array.isArray(menu.subMenu)) {
			// 		menu.subMenu.forEach((sMenu, j) => {
			// 			html += `<el-menu-item menu-tag=true index="${i + "-" + j}" link="${sMenu.link}">${sMenu.title}</el-menu-item>`;
			// 		})
			// 	}
			// 	html += "</el-menu-item-group></el-submenu>";
			// });
		}
		this.html(html+obj.str);
		this.beforeChangeMenu = function () {
		}
		this.afterChangeMenu = function () {
		}
		return this;
	}
	$.fn.navList = navList;

	var icTable = function (options = {}) {
		var that = this;
		var id = that.id = "table_" + Util.uuid(16, 52);
		var html = `<div id="${id}"><el-table :data="data" borde stripe style="width: 100%">`;
		if (Array.isArray(options.dataFields)) {
			options.dataFields.forEach((dataField) => {
				var colStr = "<el-table-column>"
				for (var attr in dataField) {
					colStr = colStr.replace("el-table-column", `el-table-column ${attr}="${dataField[attr]}"`);
				}
				colStr += "</el-table-column>";
				html += colStr;
			});
		}
		html += `</el-table></div>`;
		that.html(html);
		if (Vue) {
			that.data = options.data || {data: []},
				that.methods = that.methods || {},
				that._vue = new Vue({
					el: "#" + that.id,
					data: that.data,
					methods: that.methods
				});
		}
		return that;
	}

	exportTable = function (modal,searchForm,titles,fields,exportName, n_m_map) {
		$.ic.loadUI.show();

		$.post(`/${modal}/selectByExample`, searchForm, function (data) {

			var exportData = [];
			exportData.push(titles);
			data.data && data.data.forEach((item) => {
				var rowList = [];
				if (n_m_map) {
					fields.forEach(function (field) {
						if (new RegExp(field).test("country,city,province")) {
							ic_sms.address.forEach((address) => {
								if (address.areaid == item[field]) {
									item[field] = address.areaname
								}
							});
						}
						for (var key in n_m_map) {
							if (key != field) continue;
							ic_sms.getEnum(n_m_map[key]).forEach((en) => {
								if (en.code == item[field]) {
									item[field] = en.name
								}
							});
						}
						rowList.push(item[field])
					});
				} else {
					fields.forEach(function (field) {
						switch (field) {
							case new RegExp(field).test("country,city,province"):
								ic_sms.address.forEach((address) => {
									if (address.areaid == item[field]) {
										item[field] = address.areaname
									}
								});
								break;
							case "origin":
								ic_sms.enum["客户来源"].forEach((origin) => {
									if (origin.code == item[field]) {
										item[field] = origin.name
									}
								});
								break;
							case "trade":
								ic_sms.enum["行业"].forEach((trade) => {
									if (trade.code == item[field]) {
										item[field] = trade.name
									}
								});
								break;
							case "status":
								ic_sms.enum["客户状态"].filter((status) => {
									if (status.code == item[field]) {
										item[field] = status.name
									}
								});
								break;
							default:
								break;
						}
						rowList.push(item[field])
					});
				}
				exportData.push(rowList);
			});
			var ws = XLSX.utils.aoa_to_sheet(exportData);
			var workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
			var wbout = XLSX.write(workbook, {bookType: 'xlsx', bookSST: true, type: 'array'})
			try {
				saveAs(new Blob([wbout], {type: 'application/octet-stream'}), `${exportName}.xlsx`)
			} catch (e) {
				if (typeof console !== 'undefined') console.log(e, wbout)
			}
			$.ic.loadUI.hide();
			return wbout

		})
	}
	$.fn.icTable = icTable;

	$.ic = {}
	$.ic.loadUI = new LoadUI();

	$.verifyRole = function(business, flag, callback) {
		if (ic_sms && ic_sms.auths) {
			var auth = ic_sms.auths.filter((it)=> {
				return it.machine == "0002" && it.keyword == `${business}.${flag}`
			})[0]
			if (!auth) {
				callback && callback();
				return true;
			}
			if (auth.roles.indexOf(ic_sms.user.rid) == -1 && (!ic_sms.accessControl[auth.gid] || ic_sms.accessControl[auth.gid].indexOf(ic_sms.user.gid) == -1)) {
				alert("没有权限");
				return false;
			}
		}
		callback && callback();
		return true;
	}
	$.getRole = function(business, flag, callback) {
		if (ic_sms && ic_sms.auths) {
			var auth = ic_sms.auths.filter((it)=> {
				return it.machine == "0002" && it.keyword == `${business}.${flag}`
			})[0]
			if (!auth || !auth.roles) {
				return callback || function() {};
			}
			if (auth.roles.indexOf(ic_sms.user.rid) == -1 && (!ic_sms.accessControl[auth.gid] || ic_sms.accessControl[auth.gid].indexOf(ic_sms.user.gid) == -1)) {
				return function() {alert("没有权限")};
			}
		}
		return callback || function() {};
	}
}
