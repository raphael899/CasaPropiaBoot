const socket = io();
//var socket = io.connect('https://198.251.72.141:3000');
//const socket = io.connect("https://198.251.72.141:3000");
//elementos del dom
let message = document.getElementById('message');
let username = document.getElementById('username');
let bnt = document.getElementById('send');
let bnt2 = document.getElementById('send2');
let output = document.getElementById('output');
let myfile = document.getElementById('myfile');



bnt.addEventListener('click', function(){
    console.log("Sientrooooooo cuando me dan click");
    var numcliente = $("#idnumerocliente").val();
    var d = new Date();
    var fechHo = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();
    
    socket.emit('chat:message', {"Mensage":message.value,"FechaHora":fechHo,"numclien":numcliente});
    var datajson = {"mensaje":message.value,"fechahora":fechHo};
    mensageasesor(datajson);
});


bnt2.addEventListener('click', function(){
    var namecliente = $("#namecliente").val();
    var numcliente = $("#idnumerocliente").val();
    fetch('https://addapptech.com/bmarketmandarwpplantilla?nombre='+namecliente+'&numwp='+numcliente+'')
    .then(response => response.json())
    .then(json => console.log(json))
});





$(document).keypress(function(e) {
    if(e.which == 13) {
        var numcliente = $("#idnumerocliente").val();
        var d = new Date();
        var fechHo = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();
        
        socket.emit('chat:message', {"Mensage":message.value,"FechaHora":fechHo,"numclien":numcliente});
        var datajson = {"mensaje":message.value,"fechahora":fechHo};
        mensageasesor(datajson);
    }
});




socket.on('chat:message',function(data){
    var numcliente = $("#idnumerocliente").val();
    console.log(data);
    if(data.numclien == numcliente ){

        output.innerHTML +=`
        <div style = 'text-align: right; margin-right: 10px;'>
            <div id="myDIV">
                <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                ${data.Mensage}
                <span style="color: #ada9a9;font-size: 10px;">${data.FechaHora}</span>
                </p>
                
            </div>
        </div>
    
        </div>`;
        $("#output").animate({scrollTop: 100000});
        //console.log($("#output").text());
        $("#message").val("");

    }

});


socket.on('chat:message2',function(data){

    var tipomensaje =  data.tipomensaje;
    var tipodemedia = data.tipodemedia;
    var numcliente = $("#idnumerocliente").val();
    console.log(data);
    var d = new Date();
    var mess = d.getMonth() + 1;
    var fechHo = d.getFullYear()+"/"+mess+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();
    console.log(data.numclien);
    console.log(numcliente);
    if(data.numclien == numcliente){
        // 1 es un mensaje de audio o imagen
        if(tipomensaje > 0){
            if(tipodemedia == "audio/ogg"){
                // mensaje de audio
                output.innerHTML +=`
                <div style = 'text-align: left; margin-left: 10px;'>
                    <div id="">
                        <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                        <audio src="${data.mensaje}" preload="auto" controls></audio><br>
                        <span style="color: #ada9a9;font-size: 10px;">${fechHo}</span>
                        </p>
                    </div>
                </div>
                `;

            }else if(tipodemedia == "image/jpeg"){
                //mensaje de imagen <img src="..." class="img-fluid" alt="Responsive image">


                output.innerHTML +=`
                <div style = 'text-align: left; margin-left: 10px;'>
                    <div id="" style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>

                        <a href="#" class="pop">
                            <img src="${data.mensaje}"  class="img-thumbnail"  onclick="abririmajen('${data.mensaje}')" style="width: 300px; height: auto;">
                        </a><br>
                        <span style="color: #ada9a9;font-size: 10px;">${fechHo}</span>
                    </div>
                </div>
                `;
            }

        }else{
            output.innerHTML +=`
            <div style = 'text-align: left; margin-left: 10px;'>
                <div id="myDIVblanco">
                    <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                    ${data.mensaje}
                    <span style="color: #ada9a9;font-size: 10px;">${fechHo}</span>
                    </p>
                </div>
            </div>`;
        }

        $("#output").animate({scrollTop: 100000});
    


    }
    /*
    var datajson = {"mensaje":data.mensaje,"fechahora":fechHo,"numclien":data.numclien};
    var res2 = mensagecliente(datajson);

    console.log(res2);
    return res2;
    */
    //$("#message").val("");
});



socket.on('chat:message3',function(data){
    var numcliente = $("#idnumerocliente").val();
    console.log(data.mensaje);
    console.log("si estoy pasado por aca");
    var d = new Date();
    var fechHo = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();
    console.log(data.numclien);
    console.log(numcliente);
    if(data.numclien == numcliente){

        output.innerHTML +=`
        <div style = 'text-align: right; margin-right: 10px;'>
            <div id="myDIV">
                <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                ${data.mensaje}
                <span style="color: #ada9a9;font-size: 10px;">${data.FechaHora}</span>
                </p>
                
            </div>
        </div>`;
        $("#output").animate({scrollTop: 100000});
    
        var datajson = {"mensaje":data.mensaje,"fechahora":fechHo};
        mensageasesor(datajson);
    }

    //console.log($("#output").text());
    //$("#message").val("");
});



