$(document).ready(function(){
    $.getJSON("/swaad/fetchallcategory",function(data){
        data.map((item) => {
            $("#categoryid").append(
                
                $("<option>").text(item.categoryname).val(item.categoryid)

            );

        })
        
        $("#categoryid").formSelect();
    })

    $("#categoryid").change(function(){
        $("#foodid").empty()
       // $("#foodid").append(
       //     $("<option disabled selected>").text('Choose your Food item')
      //  )
        $.getJSON("/swaad/fetchallfood",{categoryid:$('#categoryid').val()},function(data){
            data.map((item) => {
                $("#foodid").append(
                  $("<option>").text(item.foodname).val(item.foodid)
                );
             });
             $("#foodid").formSelect();
        })

    })
})