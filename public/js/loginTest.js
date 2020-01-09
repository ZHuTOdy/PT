

function disable_log() {
  if ( window.console_bak )
    return;
  window.console_bak = window.console;
  if ( ! ('console' in window) || !('firebug' in console) ) {
    var names = ['log', 'debug', 'info', 'warn',
      // 'error',
      'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    window.console = {};
    for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {};
  }
}


disable_log();

var work_user = {}

var pro_names_conf = [];
var pro_all_conf = {}

  socket.emit( "conf.get_user" , function( data ){
    if( !data )
      return ""
    sys_user = data;
    // console.log("sys_user",sys_user)
  } )




init_pro = function(id, data) {
  var j, len, pro, results;
  $("#" + id).empty();
  if( data == pro_names_conf ){
    $("#" + id).change(function() {
      // console.log( "aaaaaaaaa:", $("#" + id).val() )
      $("#" + id).attr("disabled",true)
      socket.emit( "conf.set_socket_pro", $("#" + id).val(), work_user.sid, work_user.username, function( err ){
        $("#" + id).attr("disabled",false)
        var func = $("#pro_name").attr("func");
        if( func )
          eval( func )
      })
    });
  }

  results = [];
  results.push($("#" + id).append("<option value=''></option>"));
  for (j = 0, len = data.length; j < len; j++) {
    pro = data[j];
    var www = data[j];
    if( pro_all_conf[ www ] != undefined ){
      www = pro_all_conf[ www ].short_name
    }
    results.push($("#" + id).append("<option value=" + pro + ">" + www + "</option>"));
  }
  return results;
};


//knockout.js data-bind
function IndexViewModel() {
            this.name = ko.observable("");
            this.password = ko.observable("");
        };
var data = new IndexViewModel();
// Activates knockout.js
ko.applyBindings(data,reset());
// login


function check_workin(result, user, callback){
  if ( !result.success ) {
    return callback(result)
  }
  if( !result.data.session.port ){
    return callback(result)
  }
  socket = io.connect("//" + window.location.hostname + ":" + result.data.session.port + "/")
  socket.on('connect', function(){
    socket.emit('user.loginTest', user, callback)
  })
}


function userLogin () {
	var user = { username: $("#username").val() , password: $("#password").val() ,PIN: $("#PIN").val() };
  socket.emit('user.login', user, function (result4){
      console.log('users.login => ', JSON.stringify(result));
      if (result.success) {
        console.log('window user::::', result.data.session.nickname);
        console.log("sid",result.data.sid);  
        $('#mainframe').load('html/main.html');
        }
      // authorization failed
   		if (result.error) {
   			console.log(result.error);
        alert(result.error);
      $('#password').focus().select();
        console.log('stay in the last pages');
   		}
    })
  }


$('#login').on('click', function(){
  userLogin();
  return false;
});


function inquiry () {
  var query = { IDCard: $("#IDCard").val() };
  console.log("query111",query);
  return socket.emit("PT_user.inquiry", query , function(data){
    console.log("inquirydata111",data);
    return invoice_lists.set_data(data);
  });
}

//修改密码
function revisePwd () {
  var query = {
    username : $("#username_reset").val() ,
    password :$("#password_reset").val() ,
    newPwd : $("#newpassword-1").val()
  };

  var newpwd = {newpwd_1 : $("#newpassword-1").val(),newpwd_2 : $("#newpassword-2").val()};
  console.log("复制",newpwd.newpwd_1);
  if(newpwd.newpwd_1 == newpwd.newpwd_2)
  {
    return socket.emit("user.pwdUpdate", query , function(err){
      console.log("null data",err);
      if(err.success){
        $('#resetModal-2').foundation('reveal','open');
      }
      else{
        $('#resetModal-3').foundation('reveal','open');
      }
    });
  }
}

//忘记密码
// function resetPwd () {
//   var query  = { username:$("#username_forget").val() };
//   return socket.emit("PT_user.resetpwd" , query , function(err){
//     console.log("忘记密码",err);
//     if(err){
//       $('#forgetModal-2').foundation('reveal','open');
//     }
//     console.log("resetpwd data");
//   });
// }

//确认重置密码
function resetPwd() {
  var query = { "username":$("#username_forget").val() , "code":$("#code").val()}
  return socket.emit("user.resetpwd" , query , function(result){
    console.log("aaaaaaaaaaaa",result)
    if(result.success){
      $('#forgetModal-2').foundation('reveal','open');
    }
    if (!result.success) {
      alert(result.error)
    }
  })
}

//跳转到注册页面
function next2 () {
  $('#registerModal-2').foundation('reveal','close');
  return loadpage($('#mainframe'),'register.html',function(){
     console.log("register")
    $('body').attr('style','display:block');
  });
}


//reset
$('#reset').on('click', function(){
  document.loginForm.reset();
 });

 $('#inquiryBtn').on('click',function(){
   inquiry();
 });

 $('#reviseBtn').on('click',function(){
   revisePwd();
 });

 $('#resetBtn').on('click',function(){
   resetPwd();
 });


 $('#nextBtn2').on('click',function(){
   next2();
 });

 // $('#nextBtn3').on('click',function(){
 //   next2();
 // });

setTimeout( function(){
  try{
    $('#username').focus();
  } catch(e){}
}, 300);


$('#username').keydown(function (event){
  if ( [10, 13].indexOf( event.keyCode ) < 0 )
    return true;
  if ($(this).val().length === 0)
    return true;
  event.preventDefault();
  $('#password').focus().select();
  return false;
});

$('#password').keydown(function (event){
  if ( [10, 13].indexOf( event.keyCode ) >= 0 ){
    $('#login').focus().click();
    return false;
  }

});


$('#get_PIN').on('click', function(){
  socket.emit('user.get_PIN', $("#username").val(), function(err){
    console.log("err:",err)
  })
});

//重置密码-获取验证码
$('#get_code').on('click', function(){
  socket.emit('user.get_code', $("#username_forget").val(), function(err){
    console.log("err:",err)
  })
});

//reset
$('#reset').on('click', function(){
  document.loginForm.reset();
 });

$('#logout').on('click', function(){

});


// 仅用于汇流浏览器的关闭确认
var main_window = false;
try {
  main_window = require('nw.gui').Window.get();
} catch(e) {}
if (main_window) {
  main_window.on('close', function() {
    if (confirm('您确定要关闭浏览器吗？'))
      main_window.close(true);
  });
}


setTimeout( function(){
  try{
    $('#userName').focus();
  } catch(e){}
}, 300);

$('#year').text(moment().format('YYYY'));



$('.fa-heart').mousemove(function(){
  var ani = 'animated flash';
  $(this).removeClass(ani).addClass(ani);
})

//css隐藏下拉键
// $('body').attr('style','overflow: hidden');
$('#userRegister').click(function () {
  console.log('aaaaaaaa1111')
  $('#tarea1').load('ptj_need2know.html')
})

$('#nextBtn').click(function () {
  console.log('aaaaaaaa2222')
  $('#tarea2').load('secrecy_agreement.html')
})