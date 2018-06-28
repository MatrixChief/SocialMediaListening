//send keyword to server for twitter search
$(document).on('click','#submitBtnT',function(){
    $.ajax({
        url: "http://localhost:8080/sendKeywordT?key="+$('input[type=text][name=keyword]').val(),
        type: "post",
        data: JSON.stringify({key: $('input[type=text][name=keyword]').val()}),
        success: function(result){
            console.log(result);
            window.location.href='/chooseGetter';
        }
    });
})

// //send keyword to server for facebook search
// $(document).on('click','#submitBtnF',function(){
//     $.ajax({
//         url: "http://localhost:8080/sendKeywordF?key="+$('input[type=text][name=keyword]').val(),
//         type:"post",
//         data:JSON.stringify({key: $('input[type=text][name=keyword]').val()}),
//         success: function(result){
//             console.log(result);
//             window.location.href='/chooseGetter';
//         }
//     });
// })

//send choice for search
$(document).on('click','#sendSelect',function(){
    if($('#select_1').val()=="Twitter"){
        window.location.href='/twitterSearch';
    }
    else{
        window.location.href='/facebookSearch';
    }
})

$(document).on('click','#sendGetter',function(){
    $.ajax({
        url: "http://localhost:8080/sendGetter?key="+$('#select').val(),
        type: "post",
        data: JSON.stringify({key: $('#select').val()}),
        success: function(resultArray){
            var html = '<tr><th>Id</th><th>Post</th></tr>';
            for(var i = 0; i < resultArray.length; i++){
                html+='<tr><td>'+resultArray[i]['user_id']+"</td><td>"+resultArray[i]['post']+"</td></tr>";
            }
            console.log(html);
            $('#posts').html(html);
        }
    })
})
