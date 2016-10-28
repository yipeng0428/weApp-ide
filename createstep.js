"use strict";

function init() {
  function e(e) {
    p.showTipsMsg({
      msg: e,
      type: "error"
    })
  }
  var t = require("../../lib/react.js"),
    a = (require("../../utils/tools.js"), require("../../cssStr/cssStr.js")),
    r = (require("path"), require("../../utils/newReport.js")),
    s = require("../../config/urlConfig.js"),
    i = require("../../common/request/request.js"),
    o = (require("../../stores/webviewStores.js"), require("../../common/log/log.js")),
    c = require("glob"),
    n = require("../../config/errcodeConfig.js"),
    p = require("../../actions/windowActions.js"),
    l = (require("../../stores/projectStores.js"), require("../../actions/projectActions.js")),
    m = "touristappid",
    d = t.createClass({
      displayName: "Createstep",
      getInitialState: function() {
        return {
          projectpath: "",
          appid: "",
          appname: "",
          error: "",
          saveBtnDisable: !0,
          showQuickStart: !1,
          checked: !0,
          showLoading: !1,
          isTourist: !1
        }
      },
      chooseDir: function() {
        var e = this,
          t = document.createElement("input");
        t.setAttribute("type", "file"), t.setAttribute("nwdirectory", !0), t.style.display = "none", global.contentDocumentBody.appendChild(t), t.addEventListener("change", function(a) {
          c("*", {
            cwd: t.value
          }, function(a, r) {
            var s = 0 === r.length;
            e.setState({
              projectpath: t.value,
              showQuickStart: s
            })
          }), global.contentDocumentBody.removeChild(t)
        }), t.addEventListener("cancel", function(e) {
          global.contentDocumentBody.removeChild(t)
        }), t.click()
      },
      editAppid: function(e) {
        var t = e.target,
          a = t.value;
        this.setState({
          appid: a
        })
      },
      editAppname: function(e) {
        var t = e.target,
          a = t.value;
        this.setState({
          appname: a
        })
      },
      tourist: function() {
        this.setState({
          isTourist: !this.state.isTourist
        })
      },
      addProject: function() {
        var t = this,
          a = this.state.projectpath,
          c = this.state.isTourist,
          p = c ? m : this.state.appid,
          d = encodeURIComponent(this.state.appname);
        if (!p) return void e("请填写 appid ");
        if (!d) return void e("请填写 项目名称 ");
        if (!a) return void e("请选择 项目目录 ");
        var u = p + "_" + d,
          h = this.props.projectLists.find(function(e) {
            return e.projectid === u
          });
        if (h) return void this.setState({
          projectpath: "",
          appid: "",
          appname: "",
          saveBtnDisable: !0,
          error: "已存在 " + p + " " + decodeURIComponent(h.appname) + " 项目，请重新输入"
        });
        var f = this.state.showQuickStart && this.state.checked;
        this.setState({
          showLoading: !0
        });
        var v = {
          projectpath: "",
          appid: "",
          appname: "",
          error: "",
          saveBtnDisable: !0,
          showLoading: !1,
          isTourist: !1
        };
        if (c) {
          var b = {
            appid: p,
            appname: d,
            projectpath: a,
            projectid: u,
            app_head_img: "",
            is_admin: !1,
            isTourist: !0
          };
          l.add(b, f), r("project_createsuc", p), this.setState(v), this.props.goMain(b), i({
            url: s.touristCreateURL + "?appid=" + p,
            needToken: 1
          })
        } else i({
          url: s.createWeappURL + "?appid=" + p,
          needToken: 1
        }, function(s, i, c) {
          if (s) o.error("createstep.js create  " + s.toString()), t.setState({
            showLoading: !1
          }), e(s.toString());
          else {
            t.setState({
              showLoading: !1
            }), o.info("createstep.js create  " + c);
            // var m = JSON.parse(c),
            //   b = m.baseresponse,
            //   g = b ? parseInt(b.errcode) : 0;
            // if (g === n.DEV_App_Not_Band) return e("当前开发者未绑定此 appid ，请到 mp 后台操作后重试"), nw.Shell.openExternal("https://mp.weixin.qq.com/"), void o.error("createstep.js create project error " + g);
            // if (0 === g) {
            var m = {
              is_admin: true,
              app_head_img: 'http://wx.qlogo.cn/mmopen/icSHGibMIMB82jDEHibGFA1s6dhwMibWrQAPeRvT2w2y2rpZVM5l3BftVEr3rTgX4fXDlznnMmZY0zYtgkfFw7L3o9r0tTblGTxB/0'
            }
            if (true) {
              var j = m.app_head_img ? m.app_head_img + "/0" : "";
              return h = {
                appid: p,
                appname: d,
                projectpath: a,
                projectid: u,
                app_head_img: j,
                is_admin: m.is_admin,
                isTourist: !1
              }, l.add(h, f), r("project_createsuc", p), t.setState(v), void t.props.goMain(h)
            }
            var E = c || "系统错误";
            e(E)
          }
        })
      },
      changeCheckbox: function(e) {
        var t = e.target.checked;
        this.setState({
          checked: t
        })
      },
      render: function() {
        var e = this.props.show ? {} : a.displayNone,
          r = this.state.showQuickStart ? {} : a.visibilityHidden,
          s = this.props.createBack,
          i = this.state.isTourist,
          o = i ? "无 AppID 部分功能受限" : this.state.appid,
          c = i ? "" : "填写小程序AppID ",
          n = i ? "返回填写小程序AppID" : "无 AppID ",
          p = this.state.showLoading ? "create-form-button-primary detail-upload-dialog-button-primary-loading" : "create-form-button-primary";
        return t.createElement("div", {
          className: "create-step2",
          style: e
        }, t.createElement("div", {
          className: "create-toolbar app-drag"
        }, t.createElement("a", {
          onClick: s,
          href: "javascript:;",
          className: "create-toolbar-close app-no-drag"
        }, t.createElement("i", {
          className: "create-toolbar-back-icon"
        }), t.createElement("span", null, "返回"))), t.createElement("div", {
          className: "create-body"
        }, t.createElement("div", {
          className: "create-name"
        }, "添加项目"), t.createElement("div", {
          className: "create-form"
        }, t.createElement("div", {
          className: "create-form-item"
        }, t.createElement("label", {
          htmlFor: "",
          className: "create-form-label"
        }, "AppID"), t.createElement("div", {
          className: "create-form-input-box"
        }, t.createElement("input", {
          value: o,
          onChange: this.editAppid,
          type: "text",
          className: "create-form-input",
          disabled: i
        }), t.createElement("p", {
          style: this.state.error ? a.displayNone : {},
          className: "create-form-tips"
        }, c, t.createElement("a", {
          onClick: this.tourist,
          href: "javascript:;",
          className: "create-form-tourist"
        }, n)), t.createElement("p", {
          style: this.state.error ? {} : a.displayNone,
          className: "create-form-tips-warn"
        }, this.state.error))), t.createElement("div", {
          className: "create-form-item"
        }, t.createElement("label", {
          htmlFor: "",
          className: "create-form-label"
        }, "项目名称"), t.createElement("div", {
          className: "create-form-input-box"
        }, t.createElement("input", {
          value: this.state.appname,
          onChange: this.editAppname,
          type: "text",
          className: "create-form-input"
        }))), t.createElement("div", {
          className: "create-form-item"
        }, t.createElement("label", {
          htmlFor: "",
          className: "create-form-label"
        }, "项目目录"), t.createElement("div", {
          onClick: this.chooseDir,
          className: "create-form-input-box"
        }, t.createElement("input", {
          value: this.state.projectpath,
          disabled: "true",
          type: "text",
          className: "create-form-input create-form-input-with-pointer"
        }), t.createElement("p", {
          className: "create-form-tips"
        })), t.createElement("div", {
          className: "create-form-extra"
        }, t.createElement("a", {
          href: "javascript:;",
          onClick: this.chooseDir,
          className: "create-form-extra-button"
        }, "选择"))), t.createElement("div", {
          style: r,
          className: "create-quick-checkbox"
        }, t.createElement("input", {
          id: "quick-checkbox",
          onChange: this.changeCheckbox,
          checked: this.state.checked,
          type: "checkbox"
        }), t.createElement("label", {
          htmlFor: "quick-checkbox"
        }, "在当前目录中创建 quick start 项目"))), t.createElement("div", {
          className: "create-form-footer"
        }, t.createElement("a", {
          href: "javascript:;",
          className: "create-form-button-default",
          onClick: s
        }, "取消"), t.createElement("a", {
          onClick: this.addProject,
          href: "javascript:;",
          className: p
        }, "添加项目"))))
      }
    });
  _exports = d
}
var _exports;
init(), module.exports = _exports;