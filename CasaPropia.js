const path = require('path');
const express = require('express');
const app = express();
const http = require("http").Server(app);
const bodyParser = require('body-parser');
var unirest = require('unirest');
app.use(bodyParser.json());
const cron = require("node-cron");
var controladorsoke = "";
var access_token;

var d = new Date();
var mes = d.getMonth()+1
var fechHo = d.getFullYear()+"/"+mes+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();


const accountSid = 'AC07458462306087b5c4b32ad15bc9c31f';

const authToken = 'd36f47d422b7124e5d170af91734d049';

const client = require('twilio')(accountSid, authToken);

const server = app.listen(3006,()=>{
    console.log(`hola`);
    console.log(path.join(__dirname,'public'));
});


const SocketIO = require('socket.io');
const io = SocketIO(server);






  
    
app.use(bodyParser.urlencoded({extended: true}));


io.on('connection',(socket)=>{
    console.log("hola si hago conexion");
    socket.on('chat:message', (data) => {
        console.log(path.join(__dirname,'public/fondo1.jpg'));
        io.sockets.emit('chat:message', data);
        var mensewp = data.Mensage;
        var numwp = data.numclien;
        client.messages.create({
            from: 'whatsapp:+17865260489',
            body: mensewp,
            to: 'whatsapp:+57'+numwp
        }).then(message => res.send(message));
    })


    app.get('/mandarwpplantilla', (req, res) => {
        var nombre = req.query.nombre
        var numwp = req.query.numwp
        var datajs = {
            "mensaje":"Somos Visión Tecno, Partner Avanzado de Zoho, queremos mantener actualizada la información de su cuenta y productos Zoho para {"+nombre+"} Para iniciar por favor confírmenos su interés en mantenerse actualizado en Zoho contestando este mensaje.",
            "numclien":numwp
        };
        io.sockets.emit('chat:message3', datajs);
    
        client.messages.create({
            from: 'whatsapp:+17865260489',
            body: "Somos Visión Tecno, Partner Avanzado de Zoho, queremos mantener actualizada la información de su cuenta y productos Zoho para {"+nombre+"} Para iniciar por favor confírmenos su interés en mantenerse actualizado en Zoho contestando este mensaje.",
            to: 'whatsapp:+57'+numwp
        }).then(message => res.send(message));
      //res.send(message.sid)
      });
});



app.post('/recibirsms3', (req, res)=>{
    
    console.log(req.body);
    var tipomensa = req.body.NumMedia;
    var numero_cliente = req.body.From;
    
    if(tipomensa == 1){
        var mensClien = req.body.MediaUrl0;
        var tipomedia =req.body.MediaContentType0;
    }else{
        var mensClien = req.body.Body;
        var tipomedia = "";
    }
    
    var datajs = {"mensaje":mensClien,"numclien":numero_cliente.substr(12,23),"tipomensaje":tipomensa,"tipodemedia":tipomedia};
    console.log(datajs);
    var resio=io.sockets.emit('chat:message2', datajs);
    var numeroCli = numero_cliente.substr(12,23);
    unirest.post('https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.9506a46a953daee17f13eecb18a0ba15.a7a008a8395c9822f70cc5308272c54a&client_id=1000.SI2QTQ25O23NPKAQ4THKNZ00GIBZ9G&client_secret=6c27cddeac7488a4050e9a1285cccbc702fc58474a&grant_type=refresh_token')
    .header('Accept', 'application/json')
    .end(function (response) {
      access_token = response.body.access_token;    
        unirest.get('https://www.zohoapis.com/crm/v2/Contacts/search?criteria=((Mobile:equals:'+numeroCli+'))')
        .header('Accept', 'application/json')
        .header('Authorization','Zoho-oauthtoken '+access_token)
        .end(function (response) {
            var respuestabus = response.status;
            if(respuestabus == 200){
                var idClien = response.body.data[0].id;
                console.log(idClien);
                console.log(tipomensa);
                if(tipomensa > 0){
                    if(tipomedia == "image/jpeg"){
                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Imagen":true}]}')
                        .end(function (response) {
                            //console.log(response.body.details);
                        });

                    }else{
                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Audio":true}]}')
                        .end(function (response) {
                            //console.log(response.body);
                        });
                    }

                }else{


                    unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                    .header('Accept', 'application/json')
                    .header('Authorization','Zoho-oauthtoken '+access_token)
                    .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'"}]}')
                    .end(function (response) {
                        //console.log(response.body.data[0]);
                    });
                }                
            }else{
                unirest.get('https://www.zohoapis.com/crm/v2/Leads/search?criteria=((Mobile:equals:'+numeroCli+'))')
                .header('Accept', 'application/json')
                .header('Authorization','Zoho-oauthtoken '+access_token)
                .end(function (response2) {
                    
                    var respuestabus2 = response2.status;
                    if(respuestabus2 == 200){
                        
                        if(tipomensa > 0){
                            if(tipomedia == "image/jpeg"){

                                var idClien = response2.body.data[0].id;
                                unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                                .header('Accept', 'application/json')
                                .header('Authorization','Zoho-oauthtoken '+access_token)
                                .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Imagen":true}]}')
                                .end(function (response3) {
                                });

                            }else{


                                var idClien = response2.body.data[0].id;
                                unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                                .header('Accept', 'application/json')
                                .header('Authorization','Zoho-oauthtoken '+access_token)
                                .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Audio":true}]}')
                                .end(function (response3) {
                                });
                            }

                        }else{

                            var idClien = response2.body.data[0].id;
                            unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                            .header('Accept', 'application/json')
                            .header('Authorization','Zoho-oauthtoken '+access_token)
                            .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'"}]}')
                            .end(function (response3) {
                            });
                        }


                    }else {
                        unirest.post('https://www.zohoapis.com/crm/v2/Leads')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"Email":"posiblecliente@gmail.com","Owner": "4670577000000295001","Mobile":"'+numeroCli+'","Last_Name":"Contacto","First_Name":"WhatsApp"}]}')
                        .end(function (response) {

                        });


                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"fecha_hora_wpp":"'+fechHo+'"}]}')
                        .end(function (response4) {
                        });

                        respuestabus2 = 200;
                    }
                }); 
            }
        });  
    
    });

});

app.post('/recibirsms',(req, res)=>{
    var tipomensa = req.body.NumMedia;
    var numero_cliente = req.body.From;
     if(tipomensa == 1){
        var mensClien = req.body.MediaUrl0;
        var tipomedia =req.body.MediaContentType0;
    }else{
        var mensClien = req.body.Body;
        var tipomedia = "";
    }
    
    var datajs = {"mensaje":mensClien,"numclien":numero_cliente.substr(12,23),"tipomensaje":tipomensa,"tipodemedia":tipomedia};
    console.log(datajs);
    var resio=io.sockets.emit('chat:message2', datajs);
    var numeroCli = numero_cliente.substr(12,23);
    unirest.post('https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.9506a46a953daee17f13eecb18a0ba15.a7a008a8395c9822f70cc5308272c54a&client_id=1000.SI2QTQ25O23NPKAQ4THKNZ00GIBZ9G&client_secret=6c27cddeac7488a4050e9a1285cccbc702fc58474a&grant_type=refresh_token')
    .header('Accept', 'application/json')
    .end(function (response) {
      access_token = response.body.access_token;    
        unirest.get('https://www.zohoapis.com/crm/v2/Contacts/search?criteria=((Mobile:equals:'+numeroCli+'))')
        .header('Accept', 'application/json')
        .header('Authorization','Zoho-oauthtoken '+access_token)
        .end(function (response) {
            var respuestabus = response.status;
            if(respuestabus == 200){
                var idClien = response.body.data[0].id;
                console.log(idClien);
                console.log(tipomensa);
                if(tipomensa > 0){
                    if(tipomedia == "image/jpeg"){
                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Imagen":true}]}')
                        .end(function (response) {
                            //console.log(response.body.details);
                        });

                    }else{
                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Audio":true}]}')
                        .end(function (response) {
                            //console.log(response.body);
                        });
                    }

                }else{


                    unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                    .header('Accept', 'application/json')
                    .header('Authorization','Zoho-oauthtoken '+access_token)
                    .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'"}]}')
                    .end(function (response) {
                        //console.log(response.body.data[0]);
                    });
                }                
            }else{
                unirest.get('https://www.zohoapis.com/crm/v2/Leads/search?criteria=((Mobile:equals:'+numeroCli+'))')
                .header('Accept', 'application/json')
                .header('Authorization','Zoho-oauthtoken '+access_token)
                .end(function (response2) {
                    
                    var respuestabus2 = response2.status;
                    if(respuestabus2 == 200){
                        
                        if(tipomensa > 0){
                            if(tipomedia == "image/jpeg"){

                                var idClien = response2.body.data[0].id;
                                unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                                .header('Accept', 'application/json')
                                .header('Authorization','Zoho-oauthtoken '+access_token)
                                .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Imagen":true}]}')
                                .end(function (response3) {
                                });

                            }else{


                                var idClien = response2.body.data[0].id;
                                unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                                .header('Accept', 'application/json')
                                .header('Authorization','Zoho-oauthtoken '+access_token)
                                .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Audio":true}]}')
                                .end(function (response3) {
                                });
                            }

                        }else{

                            var idClien = response2.body.data[0].id;
                            unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                            .header('Accept', 'application/json')
                            .header('Authorization','Zoho-oauthtoken '+access_token)
                            .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'"}]}')
                            .end(function (response3) {
                            });
                        }


                    }else {
                        unirest.post('https://www.zohoapis.com/crm/v2/Leads')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"Email":"posiblecliente@gmail.com","Owner": "4670577000000295001","Mobile":"'+numeroCli+'","Last_Name":"Contacto","First_Name":"WhatsApp"}]}')
                        .end(function (response) {

                        });


                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "4670577000000295001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"fecha_hora_wpp":"'+fechHo+'"}]}')
                        .end(function (response4) {
                        });

                        respuestabus2 = 200;
                    }
                }); 
            }
        });  
    
    });

});




app.post('/resivirsms2', (req, res)=>{
    console.log("hola 2355");
    res.send('hola 2355');
    console.log(req.body);
});

app.get('/mandarwppperido', (req, res) => {
    console.log(req);
    var mensewp = req.query.mensewp;
    var numwp = req.query.numwp;
        client.messages.create({
            from: 'whatsapp:+17865260489',
            body: mensewp,
            to: 'whatsapp:+57'+numwp
        }).then(message => {
            console.log(req);
            res.send('hola');
        });
        res.send('hola');
});




/*

app.get('/mensajetext',(req, res)=>{
client.messages.create({ 
         body: 'hola don jaime', 
         from: '+12058097502',       
         to: '+573155337490' 
       }) 
      .then(message => res.send(message)) 
      .done();
})

*/

app.use(express.static(path.join(__dirname,'public')));