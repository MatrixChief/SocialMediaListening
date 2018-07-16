$(document).on('click','#submitBtn',function(){
    window.location.href="View/"+$('#options').val()
});

$(document).on('click','#Request',function(){
    var query = $('input[type=text][name=query]').val();
    var tag = $('input[type=text][name=tag]').val();
$.ajax({
        url: "http://localhost:8080/sendRequest",
        type: "post",
        contentType: "application/json; charset=utf-8",
        crossDomain:true,
        dataType:'json',
        data: JSON.stringify({query: query, tag: tag}),
        success: function(result){
            alert(result.msg);
            alert("Your query  id is: "+result.query_id);
        },
        error: function(err){
            console.log(err);
        }
    })
});

$(document).on('click','#Retrieve',function(){
    var query = $('input[type=text][name=query]').val();
    var tag = $('input[type=text][name=tag]').val();
    var id = $('input[type=text][name=id]').val();
    $.ajax({
        url: "http://localhost:8080/sendRetrieve",
        type: "post",
        contentType: "application/json; charset=utf-8",
        crossDomain:true,
        dataType:'json',
        data: JSON.stringify({query: query, tag: tag, id: id}),
        success: function(resultArray){
            var html = '<tr><th>Index</th><th>Query-ID</th><th>Query/Handle/Tag</th><th>Username</th><th>User handle</th><th>Post</th><th>Lang</th><th>Post Link</th></tr>';
            for(var i = 0; i < resultArray.length; i++){
                let index=i+1;
                html+="<tr><td>"+index+"</td><td>"+resultArray[i]['query_id']+"</td><td>"+resultArray[i]['trackables']+"</td><td>"+resultArray[i]['user_name']+"</td><td>"+resultArray[i]['user_handle']+"</td><td>"+resultArray[i]['post']+"</td><td>"+resultArray[i]['language']+"</td><td>"+resultArray[i]['twitterLink']+"</td></tr>";
            };
            $('#searchPosts').html(html);
        }
    })
});
