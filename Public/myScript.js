//send keyword to server for twitter search
$(document).on('click','#submitBtnT',function(){
    $.ajax({
        url: "http://localhost:8080/sendKeywordT?key="+$('input[type=text][name=keyword]').val()+"&count="+$('input[type=text][name=count]').val(),
        type: "post",
        data: JSON.stringify({key: $('input[type=text][name=keyword]').val(), count: $('input[type=text][name=count]')}),
        success: function(result){
            alert(result);
            $.ajax({
                url: "http://localhost:8080/sendGetter?",
                type: "post",
                data: JSON.stringify({key: $('#select').val()}),
                success: function(resultArray){
                    var html = '<tr><th>Index</th><th>User Name</th><th>Location</th><th>Language</th><th>Post</th></tr>';
                    for(var i = 0; i < resultArray.length; i++){
                        html+='<tr><td>'+resultArray[i]['user_index']+'</td><td>'+resultArray[i]['user_name']+"</td><td>"+resultArray[i]['location']+"</td><td>"+resultArray[i]['language']+"</td><td>"+resultArray[i]['post']+"</td></tr>";
                    };
                    $('#posts').html(html);
                }
            });
        }
    });
});
