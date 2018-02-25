
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
          $('.loginToogle').addClass('active')
          $('.registerToogle').removeClass('active')

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
        } else {
          console.log($('.errorMsg'))
          console.log(res.msg)
          $('.errorMsg').show()
          $('.errorMsg').html(res.msg)
          setTimeout(() => {
            $('.errorMsg').hide()
          }, 1000);
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
  //右下角图标点击，弹出登陆框
  $('.loginIcon').click(function(){
    $('.signBox').show(300)
  })
  // 弹窗关闭
  $('.signBox').click(function(e){
    e = window.event || e
    if (e.target == $(this)[0]) {
      $('.signBox').hide(300)  
    }
  })
  $('.loginToogle').click(function(){
    $('.loginBox').show()
    $('.registerBox').hide()
    $('.loginToogle').addClass('active')
    $('.registerToogle').removeClass('active')
  })
  $('.registerToogle').click(function(){
    $('.registerBox').show()
    $('.loginBox').hide()
    $('.loginToogle').removeClass('active')
    $('.registerToogle').addClass('active')
  })
  $('.unLogin').click(function(){
    $('.signBox').show()
  })
  $('.profilepic').hover(function(){
    $(this).css('transform', 'scale(1.2)')
  },function(){
    $(this).css('transform', 'scale(1)')
  })
  $('.tagText').click(function(){
    $('#nav-tags').show()
  })

})
