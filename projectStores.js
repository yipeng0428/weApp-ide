"use strict";

function init() {
  function e(e) {
    var t = 0,
      r = void 0,
      o = void 0,
      i = void 0;
    if (0 === e.length) return t;
    for (r = 0, i = e.length; r < i; r++) o = e.charCodeAt(r), t = (t << 5) - t + o, t |= 0;
    return t > 0 ? t : 0 - t
  }

  function t() {
    var e = JSON.stringify(E);
    localStorage.setItem("projectLists", e), n.writeFile(P, e)
  }

  function r(e, t) {
    if (t) {
      var r = e.projectpath,
        o = i.join(__dirname, "../weapp/newquick/");
      try {
        var p = a.sync("./**/**", {
          cwd: o
        });
        p.forEach(function(e) {
          var t = i.join(o, e),
            s = i.join(r, e),
            a = n.lstatSync(t);
          if (a.isDirectory()) c.sync(s);
          else {
            var p = n.readFileSync(t);
            n.writeFileSync(s, p)
          }
        })
      } catch (f) {
        s.error("projectStores.js initProject error " + f.toString())
      }
    }
  }

  function o(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {},
      r = require("../actions/windowActions.js"),
      o = "alert";
    r.showConfirm({
      content: e,
      type: o,
      callback: t
    })
  }
  var i = require("path"),
    n = require("fs"),
    s = require("../common/log/log.js"),
    a = require("glob"),
    c = require("mkdir-p"),
    p = require("../common/request/request.js"),
    f = require("../config/urlConfig.js"),
    u = require("../config/errcodeConfig.js"),
    j = (require("../weapp/commit/unpack.js"), require("../config/dirConfig.js")),
    d = require("events").EventEmitter,
    g = "last-select-project",
    h = require("../config/config.js"),
    l = h.SELECT_URL_TYPE,
    S = h.SELECT_UNKNOW_TYPE,
    v = j.WeappProjectInfo;
  if (!v) {
    var m = i.join(nw.App.getDataPath(), "..");
    v = i.join(m, "WeappProject")
  }
  var P = i.join(v, "projectinfo.json"),
    E = JSON.parse(localStorage.getItem("projectLists")) || [];
  n.writeFile(P, localStorage.getItem("projectLists") || "[]");
  var w = {},
    y = null,
    _ = !1,
    C = parseInt(localStorage.getItem(g)) || S,
    O = {
      Network: {
        RequestDomain: [],
        WsRequestDomain: [],
        UploadDomain: [],
        DownloadDomain: []
      },
      Setting: {
        MaxLocalstorageSize: 10,
        MaxCodeSize: 5,
        MaxWebviewDepth: 5,
        MaxBackgroundLifespan: 300,
        MaxRequestConcurrent: 5,
        MaxUploadConcurrent: 1,
        MaxDownloadConcurrent: 5
      }
    };
  E.forEach(function(t) {
    t.hash = e(t.projectid), void 0 === t.es6 && (t.es6 = !0), void 0 === t.watcher && (t.watcher = !0), void 0 === t.editWebview && (t.editWebview = !0)
  });
  var q = Object.assign({}, d.prototype, {
    getLastSelect: function() {
      if (C === l || C === S) return parseInt(C);
      var e = this.getProjectByHash(C);
      if (e) {
        var t = "projectattr" + e.hash,
          r = JSON.parse(localStorage.getItem(t)),
          o = e.isTourist;
        if (r || o) return q.setProjectConfig(e, function() {}), e
      }
      return S
    },
    setProjectType: function(e) {
      C = e, localStorage.setItem(g, e)
    },
    getCurrentProject: function() {
      return y
    },
    setProjectEs6: function(e, r) {
      var o = this.getProjectByHash(e);
      o.es6 = r, t(), this.emit("PROJECT_STORES_CHANGE_ES6", o, r)
    },
    setProjectMinified: function(e, r) {
      var o = this.getProjectByHash(e);
      o.minified = r, t()
    },
    setProjectEditWebview: function(e, r) {
      var o = this.getProjectByHash(e);
      o.editWebview = r, t(), this.emit("PROJECT_STORES_CHANGE_EDIT_WEBVIEW", o, r)
    },
    setProjectWatcher: function(e, r) {
      var o = this.getProjectByHash(e);
      o.watcher = r, t()
    },
    getProjectByHash: function(e) {
      return e = parseInt(e), E.find(function(t) {
        return t.hash === e
      })
    },
    getProjectByID: function(e) {
      return E.find(function(t) {
        return t.projectid === e
      })
    },
    getProjectList: function() {
      return s.info("projectStores.js getProjectList " + JSON.stringify(E)), E
    },
    addVerifyProject: function(e, t) {},
    add: function(o, i) {
      o.hash = e(o.projectid), o.es6 = !0, o.watcher = !0, o.editWebview = !0, E.unshift(o), r(o, i), t(), s.info("projectStores.js add " + JSON.stringify(o)), this.emit("ADD_PROJECT", E)
    },
    del: function(e) {
      var r = E.findIndex(function(t) {
        return t.projectid === e
      });
      if (r > -1) {
        var o = E[r];
        delete localStorage["projectattr" + o.hash], E.splice(r, 1), t(), s.info("projectStores.js del " + e), this.emit("DEL_PROJECT", E)
      }
    },
    close: function() {
      this.emit("CLOSE_PROJECT")
    },
    restart: function(e) {
      this.emit("RESTART_PROJECT", e)
    },
    getProjectConfig: function(e) {
      return w[e.hash]
    },
    setProjectConfig: function(e, t) {
      if (!_) {
        y = e;
        var r = "projectattr" + e.hash,
          i = JSON.parse(localStorage.getItem(r));
        // n = e.isTourist;
        /*if (n) {
          var a = Object.assign({}, O);
          return a.appid = e.appid, w[e.hash] = a, void t()
        }*/
        _ = !0, i && (w[e.hash] = i, t());
        var c = f.getWeappAttrURL,
          j = c + "?appid=" + e.appid + "&_r=" + Math.random();
        s.info("projectStores.js begin get projectAttr " + j), p({
          url: j,
          body: JSON.stringify({
            appid_list: [e.appid]
          }),
          method: "post",
          needToken: 1
        }, function(n, a, c) {
          _ = !1;
          require("../actions/windowActions.js");
          if (n) return s.error("projectStores.js end get projectAttr network error: " + JSON.stringify(n)), void(!i && o(JSON.stringify(n)));
          s.info("projectStores.js end get projectAttr " + c);
          var p = void 0;
          /*try {
            p = JSON.parse(c)
          } catch (f) {
            return s.error("projectStores.js end get projectAttr parse body error: " + c + " " + JSON.stringify(n)), void(!i && o("系统错误 " + c))
          }*/
          // var j = p.baseresponse,
          //   d = j ? parseInt(j.errcode) : 0;
          // if (0 === d) {
          if (true) {
            // var g = p.attr_list[0];
            var g = {
              Setting: {
                MaxLocalstorageSize: 10
              }
            };
            w[e.hash] = g, localStorage.setItem(r, JSON.stringify(g)), i || t()
          } else {
            if (d === u.DEV_App_Not_Band) return o("当前开发者未绑定此 appid ，请到 mp 后台操作后重试", function() {
              nw.Shell.openExternal("https://mp.weixin.qq.com/")
            }), void s.error("projectStores.js setProjectConfig error " + d);
            !i && o("系统错误 " + c)
          }
        })
      }
    }
  });
  _exports = q
}
var _exports;
init(), module.exports = _exports;