const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const port = process.env.PORT || 3000;

var options = {
  key: fs.readFileSync('/etc/ssl/private/_.addapptech.com_private_key.key'),
  cert: fs.readFileSync('/etc/ssl/certs/addapptech.com_ssl_certificate.cer')
};


var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

/*/==================================================================================================================/*/

const path = require('path');


const bodyParser = require('body-parser');
var unirest = require('unirest');
app.use(bodyParser.json());

var controladorsoke = "";
var access_token;

var d = new Date();
var mes = d.getMonth()+1
var fechHo = d.getFullYear()+"/"+mes+"/"+d.getDate()+" "+ d.getHours()+":"+ d.getMinutes();

/*
accountSid
produccion: 'AC9b7767beff59c92d1fbe2f9bd88dd6a2';
prueba: 'AC344ef39892c959c0b41995e332b053b2';
*/
const accountSid = 'AC344ef39892c959c0b41995e332b053b2';
/*
authToken
produccion: 'e4a880c2ad82294d8615a88c1c2dad5b';
prueba: '242369f3befd5aad4439fd7c6da1d462';
*/ 
const authToken = '242369f3befd5aad4439fd7c6da1d462';
const client = require('twilio')(accountSid, authToken);
//const MessagingReponse = require("twilio").twiml.MessagingResponse;

//servidor



const SocketIO = require('socket.io');
const io = SocketIO(server);

//websocket

function accessToken(){



    //CRM REAL
    //https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.93f6856e24e40b9cf4b387e5b3865f36.91208382cae502b0d33e637a4c9df8e0&client_id=1000.WC3KEEKK12E341WJO5X5SDYNDSWLPI&client_secret=e0cfac56f74b71618d65bdf2fba21d24d116b50e23&grant_type=refresh_token
  
    //CRM PRUEBA
    //https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.fd512507b3cbefe58917271f1ad9a4d3.54f86ad3db2e68aaeccdad8e43b62de9&client_id=1000.S2LP3CHUQMIKBSSEM5KSL75MVP24BH&client_secret=64489046fd417c156b0317e9d1dc924c1a28189659&grant_type=refresh_token&callback=jQuery21106273151014955092_1598303233984&_=1598303233985 
    unirest.post('https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.93f6856e24e40b9cf4b387e5b3865f36.91208382cae502b0d33e637a4c9df8e0&client_id=1000.WC3KEEKK12E341WJO5X5SDYNDSWLPI&client_secret=e0cfac56f74b71618d65bdf2fba21d24d116b50e23&grant_type=refresh_token')
    .header('Accept', 'application/json')
    .end(function (response) {
  
      access_token = response.body.access_token;
      console.log(response.body.access_token);
    });
  
  }
  accessToken();
    
app.use(bodyParser.urlencoded({extended: true}));


io.on('connection',(socket)=>{
  console.log("<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>");
  console.log("si hay coneccion");
    socket.on('chat:message', (data) => {
        console.log("si hago conecion con scket");
        console.log(path.join(__dirname,'public/fondo1.jpg'));
        io.sockets.emit('chat:message', data);
        var mensewp = data.Mensage;
        var numwp = data.numclien;
        client.messages.create({
            //mediaUrl: [path.join(__dirname,'public/fondo1.jpg')],
            from: 'whatsapp:+14155238886',//17863475781 real // 14155238886 prueba
            body: mensewp,
            to: 'whatsapp:+57'+numwp
        }).then(message => res.send(message));
    })

    /*
    app.post('/resivirsms', (req, res)=>{
        var numero_cliente = req.body.From;
        numero_cliente.substr(12,23)
        var datajs = {"mensaje":req.body.Body,"numclien":numero_cliente.substr(12,23)};
        io.sockets.emit('chat:message2', datajs);
    });
    */
    app.get('/mandarwpplantilla', (req, res) => {
        var nombre = req.query.nombre
        var numwp = req.query.numwp
        var datajs = {
            "mensaje":"Somos Visión Tecno, Partner Avanzado de Zoho, queremos mantener actualizada la información de su cuenta y productos Zoho para {"+nombre+"} Para iniciar por favor confírmenos su interés en mantenerse actualizado en Zoho contestando este mensaje.",
            "numclien":numwp
        };
        io.sockets.emit('chat:message3', datajs);
    
        client.messages.create({
            from: 'whatsapp:+14155238886',//17863475781 real // 14155238886 prueba
            body: "Somos Visión Tecno, Partner Avanzado de Zoho, queremos mantener actualizada la información de su cuenta y productos Zoho para {"+nombre+"} Para iniciar por favor confírmenos su interés en mantenerse actualizado en Zoho contestando este mensaje.",
            to: 'whatsapp:+57'+numwp
        }).then(message => res.send(message));
      //res.send(message.sid)
      });
});



app.post('/resivirsms', (req, res)=>{
    console.log("hola");

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
    unirest.get('https://www.zohoapis.com/crm/v2/Contacts/search?criteria=((Mobile:equals:'+numeroCli+'))')
    .header('Accept', 'application/json')
    .header('Authorization','Zoho-oauthtoken '+access_token)
    .end(function (response) {
        var respuestabus = response.status;
        if(respuestabus == 200){
            var idClien = response.body.data[0].id;



            console.log(tipomensa);
            console.log(tipomedia);

            if(tipomensa > 0){
                if(tipomedia == "image/jpeg"){
                    unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                    .header('Accept', 'application/json')
                    .header('Authorization','Zoho-oauthtoken '+access_token)
                    .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Imagen":true}]}')
                    .end(function (response) {
                        console.log(response.body);
                    });

                }else{
                    unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                    .header('Accept', 'application/json')
                    .header('Authorization','Zoho-oauthtoken '+access_token)
                    .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Audio":true}]}')
                    .end(function (response) {
                        console.log(response.body);
                    });
                }

            }else{


                unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                .header('Accept', 'application/json')
                .header('Authorization','Zoho-oauthtoken '+access_token)
                .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'"}]}')
                .end(function (response) {
                    console.log(response.body);
                });
            }





            
        }else{
            unirest.get('https://www.zohoapis.com/crm/v2/Leads/search?criteria=((Mobile:equals:'+numeroCli+'))')
            .header('Accept', 'application/json')
            .header('Authorization','Zoho-oauthtoken '+access_token)
            .end(function (response2) {
                
                var respuestabus2 = response2.status;
                console.log(respuestabus2);
                if(respuestabus2 == 200){
                     
                    if(tipomensa > 0){
                        if(tipomedia == "image/jpeg"){

                            var idClien = response2.body.data[0].id;
                            unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                            .header('Accept', 'application/json')
                            .header('Authorization','Zoho-oauthtoken '+access_token)
                            .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Imagen":true}]}')
                            .end(function (response3) {
                            });

                        }else{


                            var idClien = response2.body.data[0].id;
                            unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                            .header('Accept', 'application/json')
                            .header('Authorization','Zoho-oauthtoken '+access_token)
                            .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'","Audio":true}]}')
                            .end(function (response3) {
                            });
                        }

                    }else{

                        var idClien = response2.body.data[0].id;
                        unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                        .header('Accept', 'application/json')
                        .header('Authorization','Zoho-oauthtoken '+access_token)
                        .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"Posible_Cliente":"'+idClien+'","fecha_hora_wpp":"'+fechHo+'"}]}')
                        .end(function (response3) {
                        });
                    }


                }else {
                    unirest.post('https://www.zohoapis.com/crm/v2/Leads')
                    .header('Accept', 'application/json')
                    .header('Authorization','Zoho-oauthtoken '+access_token)
                    .send('{"data": [{"Email":"psoblecliente@gmail.com","Owner": "461888000021433001","Mobile":"'+numeroCli+'","Last_Name":"Contacto","First_Name":"WhatsApp"}]}')
                    .end(function (response) {
                    });


                    unirest.post('https://www.zohoapis.com/crm/v2/mensajes_wpp')
                    .header('Accept', 'application/json')
                    .header('Authorization','Zoho-oauthtoken '+access_token)
                    .send('{"data": [{"mensaje":"'+mensClien+'","Owner": "461888000021433001","numero_cliente":"'+'cel'+numeroCli+'","responde":false,"fecha_hora_wpp":"'+fechHo+'"}]}')
                    .end(function (response4) {
                    });

                    respuestabus2 = 200;
                }
            }); 
        }
    });    
    
});





app.get('/mandarwppperido', (req, res) => {
    var mensewp = req.query.mensewp;
    var numwp = req.query.numwp;
        client.messages.create({
            from: 'whatsapp:+14155238886',//17863475781 real // 14155238886 prueba
            body: mensewp,
            to: 'whatsapp:+57'+numwp
        }).then(message => res.send(message));
  //res.send(message.sid)
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

//archivos estaticos que van al navegador
app.use(express.static(path.join(__dirname,'public')));