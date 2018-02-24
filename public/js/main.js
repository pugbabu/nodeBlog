$(function () {
  var $registerBtn = $('#registerBtn')
  var $loginBtn = $('#loginBtn')
  var $logOut = $('#logOut')
  var submitBtn = $('#submit')
  var toRegitster = $('#toRegitster')
  toRegitster.click(function(){
    $('.loginBox').hide()
    $('.registerBox').show()
  })
  $registerBtn.click(function () {
    console.log($('#username2').val(), 'tijiao')
    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: {
        username: $('#username2').val(),
        password: $('#inputPassword4').val(),
        repassword: $('#repassword1').val()
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.code === 1000) {
          $('.registerBox').hide()
          $('.loginBox').show()
        }
      }
    })
  })
  $loginBtn.click(function () {
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: $('#username1').val(),
        password: $('#inputPassword3').val()
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.code == 1001) {
          window.location.reload()
          // $('.userInfo').show()
          // $('.loginBox').hide()
        }
        
      }
    })
  })
  $logOut.click(function() {
    $.ajax({
      type: 'post',
      url: '/api/user/logout',
      data: {},
      success: function (res) {
        console.log(res)
        if (res.code == 6) {
          window.location.reload()
        }
      }
    })
  })
  submitBtn.click(function(){
    var num = location.search.indexOf('=')
    var str = location.search.substr(num + 1)
    $.ajax({
      type: 'post',
      url: '/api/comment/post',
      data: {
        comment: $('#commentText').val(),
        contentId: str
      },
      dataType: 'json',
      success: function(res){
        console.log(res, '返回')
        if (res.code == 1000) {
          location.reload()
        }
      }
    })
  })


})
