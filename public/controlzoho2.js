ZOHO.embeddedApp.on("PageLoad",function(data){
    id = data.EntityId;
    var Entity = data.Entity;
    if(Entity == "Leads"){
        var idcliente = $("#idcliente").val();
        var config = { id: idcliente}
        ZOHO.CRM.API.getRelatedRecords({Entity:data.Entity,RecordID:data.EntityId}).then(function(data){

            $("#updateNombre").val(data.data[0].Last_Name);
            $("#updateApellidos").val(data.data[0].First_Name);
            $("#updateCorreoelectronicoprincipal").val(data.data[0].Email);
            $("#updatetitulo").val(data.data[0].Designation);
            $("#updatetelefono").val(data.data[0].Phone);
            $("#updateSitioweb").val(data.data[0].Website);
            $("#uptateCorreoelectronico").val(data.data[0].Secondary_Email);
            $("#updateIDSkype").val(data.data[0].Skype_ID);
            $("#updateCalle").val(data.data[0].Street);
            $("#updateCiudad").val(data.data[0].City);
            $("#updateEstado").val(data.data[0].State);
            $("#updatePais").val(data.data[0].Country);
            $("#updateCodigopostal").val(data.data[0].Zip_Code);
            $("#updateBarrio").val(data.data[0].Barrio);
            $("#updateDescripcion").val(data.data[0].Description);
        })
        $("#flip2").hide();
    }else {
        var idcliente = $("#idcliente").val();
        var config = { id: idcliente}
        ZOHO.CRM.API.getRelatedRecords({Entity:data.Entity,RecordID:data.EntityId}).then(function(data){
            console.log(data);





            $("#updateNombre2").val(data.data[0].Last_Name);
            $("#updateApellidos2").val(data.data[0].First_Name);
            $("#updateCorreoelectronicoprincipal2").val(data.data[0].Email);
            $("#updatetelefono2").val(data.data[0].Phone);
            $("#uptateCorreoelectronico2").val(data.data[0].Secondary_Email);
            $("#updateIDSkype2").val(data.data[0].Skype_ID);
            $("#updateCalle2").val(data.data[0].Calle);
            $("#updateCiudad2").val(data.data[0].Ciudad_en_Colombia);
            $("#updateEstado2").val(data.data[0].Estudio);
            $("#updatePais2").val(data.data[0].Pais);
            $("#updateCodigopostal2").val(data.data[0].C_digo_Postal);
            $("#updateDescripcion2").val(data.data[0].Description);
            $("#updateOtrotelefono2").val(data.data[0].Phone);
            $("#updateDepartamento2").val(data.data[0].Department);
            $("#updateTelefonoparticular2").val(data.data[0].Home_Phone);
            $("#updateDocumuento").val(data.data[0].CC);

        })
        $("#flip").hide();
    }
    ZOHO.CRM.API.getRelatedRecords({Entity:data.Entity,RecordID:data.EntityId}).then(function(data){
        $("#numerocontacto").val(data.data[0].Mobile);
        console.log("id");
        console.log(data);
        $('#headerorder').append(`<input id="idnumerocliente" value = "${data.data[0].Mobile}"></input>`);

        $('#headerorder').append(`<input id="idcliente" value = "${data.data[0].id}"></input>`);
        
        $('#headerorder').append(`<input id="namecliente" value = "${data.data[0].Full_Name}"></input>`);

        $('#headerorder').append(`<input id="nameEntity" value = "${Entity}"></input>`);


        if(data.data[0].Mobile > 0){
            listar_mesages();
        }
    })
});
var d = new Date();
var fechHo = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();

function mensageasesor(data) {

    var mensage = data.mensaje;
    var fecha_hora_wpp = data.fechahora;
 
    var numcliente = $("#idnumerocliente").val();
    var idcliente = $("#idcliente").val();
    //var nameEntity = localStorage.getItem('moduloabierto');


console.log("hola 2355");
    if(nameEntity == "Leads"){
        var recordData = {
            "mensaje": mensage,
            "numero_cliente":"cel"+numcliente,
            "responde": true,
            "Owner": "4670577000000295001",
            //"Name": numcliente,
            "fecha_hora_wpp":fecha_hora_wpp,
            "Posible_Cliente":idcliente
        }

    }else{
        var recordData = {
            "mensaje": mensage,
            "numero_cliente":"cel"+numcliente,
            "responde": true,
            "Owner": "4670577000000295001",
            //"Name": numcliente,
            "fecha_hora_wpp":fecha_hora_wpp,
            "Cliente":idcliente
        }
    }
    console.log(recordData);
    ZOHO.CRM.API.insertRecord({Entity:"mensajes_wpp",APIData:recordData,Trigger:["workflow"]}).then(function(data){
        console.log("235598784410");
        console.log(data);
    });

};



function mensagecliente(data) {

    var idcliente = $("#idcliente").val();
    var nameEntity = $("#nameEntity").val();
    //{"mensaje":data,"fechahora":fechHo}
    var mensage = data.mensaje;
    var fecha_hora_wpp = data.fechahora;
    var numcliente = data.numclien;
    console.log(numcliente);
    if(nameEntity == "Leads"){
        var recordData = {
            "mensaje": mensage,
            "numero_cliente":"cel"+numcliente,
            "responde": false,
            "Owner": "4670577000000295001",
            //"Name": numcliente,
            "fecha_hora_wpp":fecha_hora_wpp,
            "Posible_Cliente":idcliente
        }

    }else{
        var recordData = {
            "mensaje": mensage,
            "numero_cliente":"cel"+numcliente,
            "responde": false,
            "Owner": "4670577000000295001",
            //"Name": numcliente,
            "fecha_hora_wpp":fecha_hora_wpp,
            "Cliente":idcliente
        }
    }

    ZOHO.CRM.API.insertRecord({Entity:"mensajes_wpp",APIData:recordData,Trigger:["workflow"]}).then(function(data){

        console.log(data);
        
        $('#headerorder').append(`<input id="respuesta" value = "${data.data[0].code}"></input>`);
    });
    var respuesta = "GUARDADO_DESDE_WI";
    return respuesta;
};


function listar_mesages(){
    console.log("hola soy de bmarket");
    var nameEntity = $('#nameEntity').val();
    //localStorage.setItem("moduloabierto", nameEntity);
    var numcliente = $("#idnumerocliente").val();
    console.log(numcliente);
    console.log(nameEntity);
    var func_name = "mensajes_wpp_clientes";
    var req_data ={
    "arguments": JSON.stringify({
        "numeroclien" : numcliente
    })};
    ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    .then(function(data){
        console.log(data);
        var valores = JSON.parse(data.details.output);
        var nummax = valores.longitud+1;
        for(var i= 0; i < nummax ; i++) {
            console.log(i);
            if(valores.datajson[i].responde == false ){
                console.log("Soy cliente");
                console.log(valores.datajson[i]);
                if(valores.datajson[i].imajen == true){
                    document.getElementById('output').innerHTML +=`
                    <div style = 'text-align: left; margin-left: 10px;'>
                        <div id="" style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
    
                            <a href="#" class="pop">
                                <img src="${valores.datajson[i].mensaje}"  class="img-thumbnail"  onclick="abririmajen('${valores.datajson[i].mensaje}')" style="width: auto; height: 300px;">
                            </a><br>
                            <span style="color: #ada9a9;font-size: 10px;">${valores.datajson[i].fecha_hora_wpp}</span>
                        </div>
                    </div>`;
                }else if(valores.datajson[i].audio == true){
                    document.getElementById('output').innerHTML +=`
                    <div style = 'text-align: left; margin-left: 10px;'>
                        <div id="">
                            <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                            <audio src="${valores.datajson[i].mensaje}" preload="auto" controls></audio><br>
                            <span style="color: #ada9a9;font-size: 10px;">${valores.datajson[i].fecha_hora_wpp}</span>
                            </p>
                        </div>
                    </div>
                    `;
                }else {
                    document.getElementById('output').innerHTML +=`
                    <div style = 'text-align: left; margin-left: 10px;'>
                        <div id="myDIVblanco">
                            <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                            ${valores.datajson[i].mensaje}
                            <span style="color: #ada9a9;font-size: 10px;">${valores.datajson[i].fecha_hora_wpp}</span>
                            </p>
                        </div>
                    </div>`;
                }

                
            }else{
                console.log("Soy asesor");
                console.log(valores.datajson[i].mensaje);
                document.getElementById('output').innerHTML +=`
                <div style = 'text-align: right; margin-right: 10px;'>
                    <div id="myDIV">
                        <p id='asesor' style = 'margin-bottom: 3px; margin-left: 8px; margin-right: 8px; margin-top: 3px;'>
                        ${valores.datajson[i].mensaje}
                        <span style="color: #ada9a9;font-size: 10px;">${valores.datajson[i].fecha_hora_wpp}</span>
                        </p>
                        
                    </div>
                </div>`;

            };
            
        }
    })
}
function UPDATEPOSIBLECLIENTE(){
    var idcliente = $("#idcliente").val();
    var updateNombre = $("#updateNombre").val();
    var updateApellidos = $("#updateApellidos").val();
    var updateCorreoelectronicoprincipal = $("#updateCorreoelectronicoprincipal").val();
    var updateempresa = $("#updateempresa").val();
    var updatetitulo = $("#updatetitulo").val();
    var updatetelefono = $("#updatetelefono").val();
    var updateSitioweb = $("#updateSitioweb").val();
    var uptateCorreoelectronico = $("#uptateCorreoelectronico").val();
    var updateIDSkype = $("#updateIDSkype").val();
    var updateCalle = $("#updateCalle").val();
    var updateCiudad = $("#updateCiudad").val();
    var updateEstado = $("#updateEstado").val();
    var updatePais = $("#updatePais").val();
    var updateCodigopostal = $("#updateCodigopostal").val();
    var updateBarrio = $("#updateBarrio").val();
    var updateDescripcion = $("#updateDescripcion").val();
    var config={
        Entity:"Leads",
        APIData:{
            "id": idcliente,
            "Last_Name": updateNombre,
            "First_Name": updateApellidos,
            "Email": updateCorreoelectronicoprincipal,
            "Company": updateempresa,
            "Designation": updatetitulo,
            "Phone": updatetelefono,
            "Website": updateSitioweb,
            "Secondary_Email": uptateCorreoelectronico,
            "Skype_ID": updateIDSkype,
            "Street": updateCalle,
            "City": updateCiudad,
            "State": updateEstado,
            "Country": updatePais,
            "Zip_Code": updateCodigopostal,
            "Barrio": updateBarrio,
            "Description": updateDescripcion
        },
        Trigger:["workflow"]
      }
      console.log(config);
      ZOHO.CRM.API.updateRecord(config)
      .then(function(data){
          console.log(data);
          if(data.data[0].code == "SUCCESS"){
            var example = $('#example');
            switch (example.attr('data-icon')) {
                case 'fa':
                    Msg.icon = Msg.ICONS.FONTAWESOME;
                    break;
                    
                case 'bs':
                    Msg.icon = Msg.ICONS.BOOTSTRAP;
                    break;
                    
                case 'no':
                    Msg.iconEnabled = false;
                    break;
                    
                default:
                    Msg.icon = {
                        info: 'fa fa-bath',
                        success: 'fa fa-anchor',
                        warning: 'fa fa-bell-o',
                        danger: 'fa fa-bolt'
                    };
            }
            
            Msg.extraClass = example.attr('data-extra-class');
            
        
        
            var msgStr = 'Datos Actulizados';
        
        
        
            Msg["success"](msgStr);
              
          }
      })
      
}
function UPDATEPOSIBLECLIENTE2(){
    var idcliente = $("#idcliente").val();
    var updateNombre = $("#updateNombre2").val();
    var updateApellidos = $("#updateApellidos2").val();
    var updateCorreoelectronicoprincipal = $("#updateCorreoelectronicoprincipal2").val();

    var updateDocumuento = $("#updateDocumuento").val();
    var updatetelefono = $("#updatetelefono2").val();
    var uptateCorreoelectronico = $("#uptateCorreoelectronico2").val();
    var updateCalle = $("#updateCalle2").val();
    var updateCiudad = $("#updateCiudad2").val();
    var updateEstado = $("#updateEstado2").val();
    var updatePais = $("#updatePais2").val();
    var updateCodigopostal = $("#updateCodigopostal2").val();
    var updateDescripcion = $("#updateDescripcion2").val();
    var updateOtrotelefono2 = $("#updateOtrotelefono2").val();
    var updateDepartamento2 = $("#updateDepartamento2").val();
    var updateTelefonoparticular2 = $("#updateTelefonoparticular2").val();
   


    var config={
        Entity:"Contacts",
        APIData:{
            "id": idcliente,
            "Last_Name": updateNombre,
            "First_Name": updateApellidos,
            "Email": updateCorreoelectronicoprincipal,
            "Phone": updatetelefono,
            "Secondary_Email": uptateCorreoelectronico,
            "Calle": updateCalle,
            "Ciudad_en_Colombia": updateCiudad,
            "Estudio": updateEstado,
            "Pais": updatePais,
            "C_digo_Postal": updateCodigopostal,
            "Description": updateDescripcion,
            "Phone": updateOtrotelefono2,
            "Department": updateDepartamento2,
            "Home_Phone": updateTelefonoparticular2,
            "CC":updateDocumuento
        },
        Trigger:["workflow"]
        
      }
      console.log(config);
      ZOHO.CRM.API.updateRecord(config)
      .then(function(data){
          if(data.data[0].code == "SUCCESS"){
            var example = $('#example');
            switch (example.attr('data-icon')) {
                case 'fa':
                    Msg.icon = Msg.ICONS.FONTAWESOME;
                    break;
                    
                case 'bs':
                    Msg.icon = Msg.ICONS.BOOTSTRAP;
                    break;
                    
                case 'no':
                    Msg.iconEnabled = false;
                    break;
                    
                default:
                    Msg.icon = {
                        info: 'fa fa-bath',
                        success: 'fa fa-anchor',
                        warning: 'fa fa-bell-o',
                        danger: 'fa fa-bolt'
                    };
            }
            
            Msg.extraClass = example.attr('data-extra-class');
            
        
        
            var msgStr = 'Datos Actulizados';
        
        
        
            Msg["success"](msgStr);
              
          }
      })
      
}
ZOHO.embeddedApp.init();

