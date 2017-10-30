 

$(document).ready(function(){
  $('.weixincode a').mouseover(function(){
    $('.codeerwei').show();
  }).mouseout(function(){
    $('.codeerwei').hide();
  })

  $('#exit').click(function(){
     $.get('/cloudui/ws/user/logout'+'?v='+(new Date().getTime()),function(data){
        if(data=='true')
        {
            window.location='app/pages/login.html';
        }else
        {
            return false;
        }
     })
  })
})