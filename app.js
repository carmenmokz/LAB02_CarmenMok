var url = require('url');
var https = require('https');
var fs = require('fs');
//USER FAVORITE CURRENCIES
var favorite_currency = ['CRC/CostaRica']; 
//CURRENCY DATABASE
var DB = [['BMD/Bermuda','Bermuda','Dolar Bermudeño','$','bm-flag.jpg'], 
          ['BRL/Brasil','Brasil','Real Brazileño','R$','br.png'],
		  ['BGN/Bulgaria','Bulgaria','Leva Bulgaro','лв','bg.png'],
		  ['CAD/Canada','Canada','Dolar Canadiense','$','ca.png'],
		  ['CLP/Chile','Chile','Peso Chileno','$','cl.png'],
		  ['CNY/China','China','Yuan','¥','cn.png'],
		  ['COP/Colombia','Colombia','Peso Colombiano','$','co.png'],
		  ['CRC/CostaRica','Costa Rica','Colón Costarricense','₡','cr.png'],
		  ['CZK/RepublicaCheca','República Checa','Corona Checa','Kč','cz.png'],
		  ['DKK/Dinamarca','Dinamarca','Corona Danesa','kr$','dk.png'],
		  ['DOP/RepublicaDominicana','República Dominicana','Peso Dominicano','RD$','do.png'],
		  ['PLN/Polonia','Polonia','Złoty Polaco','zł','pl.png'],
		  ['EUR/UnionEuropea','Unión Europea','Euro','€','Bandera_de_la_UE.png'],
		  ['KRW/CoreaDelSur','Corea del Sur','Won','₩','kr.png'],
		  ['KPW/CoreaDelNorte','Corea del Norte','Won','₩','kp.png'],
		  ['HKD/HongKong','Hong Kong','Dolar Hong Kong','$','hk.png'],
		  ['JPY/Japon','Japón','Yen Japonés','¥','jp.png'],
		  ['MXN/Mexico','México','Peso Mexicano','$','mx.png'],
		  ['NIO/Nicaragua','Nicaragua','Córdoba Nicaragüense','C$','ni.png'],
		  ['PAB/Panama','Panamá','Balboa Panameño','B/.','pa.png'],
		  ['AUD/Australia','Australia','Dolar Australiano','$','au.png'],
		  ['CUP/Cuba','Cuba','Peso Cubano','₱','cu.png'],
		  ['GBP/GranBretana','Gran Bretaña','Libra Reino Unido','£','gb.png'],
		  ['USD/EstadosUnidos','Estados Unidos','Dolar','$','us.png'],
		  ['VEF/Venezuela','Venezuela','Bolivar Venezolano','Bs','ve.png']];

//------------------------MY FUNCTIONS-------------------------------------

//ADD OR REMOVE USER CURRENCY TO LIST
function addFav(obj){
	if(favorite_currency.includes(obj)){
		var remove_index = favorite_currency.indexOf(obj);
		favorite_currency.splice(remove_index,1);
		//console.log(favorite_currency);
	}else{
		favorite_currency.push(obj);
		//console.log(favorite_currency);
	}
}

//USE API TO CONVERT CURRENCY
function convertCurrency(amount, fromCurrency, toCurrency) {
    
    var query = fromCurrency + '_' + toCurrency;
    var url = 'https://free.currencyconverterapi.com/api/v6/convert?q=' + query + '&compact=ultra'

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false); //false for syncronous request
    xmlHttp.send();
    var change = Object.values(JSON.parse(xmlHttp.responseText))[0];
	var result = parseFloat(amount) * parseFloat(change);
	//console.log("change "+change+" result "+result);
    return result;
}
    
		  
//-------------------------------------------------------------------------
		  
function renderHTML(path, response) {
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}


module.exports = {
  handleRequest: function(request, response) {

      var path = url.parse(request.url).pathname; //request
      //console.log(path);
	  var pathSplit = path.split('/'); //splitted request

      if(path.includes('css')){
        response.writeHead(200, {'Content-Type': 'text/css'});
      }else{
        response.writeHead(200, {'Content-Type': 'text/html'});
      }
	  
	  if(path.includes('addCurrency')){
		//console.log(path);
		addFav(pathSplit[2]+'/'+pathSplit[3]);
		response.end();
		return;
	  }
	  
	  if(path.includes('getFavCurrency')){
		//console.log(favorite_currency.toString());
		response.write(favorite_currency.toString()); //SERVICE RESPONSE
		response.end(); //END RESPONSE OF SERVICE
		return;
	  }
	  
	  if(path.includes('currencyData')){
		for(i=0; i<DB.length ;i++){
			if(DB[i].includes(pathSplit[2]+"/"+pathSplit[3])){
				//console.log("DATA "+DB[i].toString());
				response.write(DB[i].toString()); //SERVICE RESPONSE
				response.end(); //END RESPONSE OF SERVICE
				return;
			}
		}
	  }
	  
	  if(path.includes('getChangedCurrency')){
		  var toConvert = favorite_currency;
		  var base = pathSplit[2];
		  var value = pathSplit[4];
		  var convertedCurrency = [];
		  //console.log(path.split('/'));
		  if(value===''){
			  value = 0;
		  }
		  
		  for(i=0; i<toConvert.length ;i++){
			  var temp = toConvert[i].split('/');
			  var result = convertCurrency(value, base, temp[0]);
			  //console.log(base+" "+temp[0]);
			  convertedCurrency.push(result);
		  }
		  //console.log(convertedCurrency);
		  response.write(convertedCurrency.toString());
		  response.end();
		  return;
	  }

      switch (path) {
          case '/':
			  console.log('Servidor Encendido');
              renderHTML('./converter.html', response);
              break;
		  
          default:
              renderHTML("."+path, response);
              break;
              response.writeHead(404);
              response.write('Route not defined');
              response.end();
      }

  }
};