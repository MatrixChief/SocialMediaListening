//send keyword to server for twitter search
$(document).on('click','#submitBtnT',function(){
    $.ajax({
        url: "http://localhost:8080/sendKeyword?key="+$('input[type=text][name=keyword]').val(),
        type:"post",
        data:JSON.stringify({key: $('input[type=text][name=keyword]').val()}),
        success: function(result){
            console.log(result);
            window.location.href='/chooseGetter';
        }
    });
})

//send keyword to server for facebook search
$(document).on('click','#submitBtnF',function(){
    $.ajax({
        url: "http://localhost:8080/sendKeyword?key="+$('input[type=text][name=keyword]').val(),
        type:"post",
        data:JSON.stringify({key: $('input[type=text][name=keyword]').val()}),
        success: function(result){
            console.log(result);
            window.location.href='/chooseGetter';
        }
    });
})

//send choice for search
$(document).on('click','#sendSelect',function(){
    if($('#select').val()=="Twitter"){
        window.location.href='/twitterSearch';
    }
    else{
        window.location.href='/facebookSearch';
    }
})
