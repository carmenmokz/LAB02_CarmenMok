
//ENVIA SOLICITUD PARA AGREGAR MONEDA FAVORITA A favorite_currency
function addCurrency(obj){
	//alert(obj.id);
	var xmlHttp = new XMLHttpRequest(); //Get html data
	xmlHttp.open("GET", "addCurrency/" + obj.id, false); //false for syncronous request
	xmlHttp.send();
	var answer = xmlHttp.responseText;
	//alert(answer);
	changeStar(obj);
	return answer;
}

//CAMBIA ESTADO DE ESTRELLA
function changeStar(obj){
	var current_src = obj.src;
	if(current_src.includes('empty')){
		obj.src = 'images/star.png';
	}else{
		obj.src = 'images/star-empty.png';
	}
}	

//RETORNA STRING CON MONEDAS FAVORITAS DEL USUARIO
function getUserCurrency(){
	var xmlHttp = new XMLHttpRequest(); //Get html data
	xmlHttp.open("GET", "getFavCurrency", false); //false for syncronous request
	xmlHttp.send();
	var answer = xmlHttp.responseText;
	//alert(answer);
	return answer;
}

//OBTINENE DATOS EN STRING DE LA MONEDA CON EL ID DEL MISMO
function getUserCurrencyData(id){
	var xmlHttp = new XMLHttpRequest(); //Get html data
	xmlHttp.open("GET", "currencyData/" + id, false); //false for syncronous request
	xmlHttp.send();
	var data = xmlHttp.responseText;
	//alert(data);
	return data;
}


//CONVIERTE UNA DIVISA A OTRA
function getChangedCurrency(obj){
	var xmlHttp = new XMLHttpRequest(); //Get html data
	xmlHttp.open("GET", "getChangedCurrency/" + obj.id + "/" + obj.value, false); //false for syncronous request
	xmlHttp.send();
	var answer = xmlHttp.responseText;
	//alert(answer);
	return answer;
}

//CARGA EN HTML LAS ESTRELLAS SELECCIONADAS POR EL USUARIO
function loadStarStatus(){
	var userFav = getUserCurrency().split(',');	
	var data = document.getElementById('currency_options').getElementsByTagName('*'); //carga todos los elementos del div con id "currency_options" 
	
	for (var i = 0; i < data.length; i++) {
        if (userFav.includes(data[i].id)) {
            data[i].src = 'images/star.png';
        }
    }
}

function changeCurrency(obj){
	var data = getUserCurrency().split(',');
	var currency = getChangedCurrency(obj).split(',');
	
	for (var i = 0; i < data.length; i++) {
		//console.log(data[i]);
        document.getElementById(data[i]).value = currency[i];
    }
}

//CARGA MONEDAS FAVORITAS EN HTML converter.html
function loadUserCurrency(){
	var load = getUserCurrency().split(',');
	var data = document.getElementById('user-currency');
	
	for(i=0; i<load.length ;i++){
		var info = getUserCurrencyData(load[i]).split(',');
		var id = info[0];
		var idSplit = id.split('/');
		var country_name = info[1];
		var money = info[2];
		var symbol = info[3];
		var flag = info[4];
		
		var code = "<div class=\"row\" align=\"center\" id='new-item'>\n" +
"            <div class=\"col-sm-2\">\n" +
"                <img class=\"flag-img\" src=\"images/"+flag+"\" alt=\"\">\n" +
"            </div>\n" +
"            <div class=\"col-sm-3\">\n" +
"                <div class=\"col-sm\">\n" +
"                  <b>País:</b> "+country_name+"\n" +
"                </div>\n" +
"                <div class=\"col-sm\">\n" +
"                    <b>ID:</b> "+idSplit[0]+"\n" +
"                </div>\n" +
"                <div class=\"col-sm\">\n" +
"                    <b>Moneda:</b> "+money+"\n" +
"                </div>\n" +
"            </div>\n" +
"            <div class=\"col-sm\">\n" +
"                <h3>"+symbol+" <input id=\""+id+"\" type=\"number\" value=\"0.0\" onchange=\"changeCurrency(this)\"></h3>\n" +
"            </div>\n" +
"        </div>\n" +
"\n" +
"        <hr>\n" +
"		"
    
	data.insertAdjacentHTML('beforeend', code);
	}

}



