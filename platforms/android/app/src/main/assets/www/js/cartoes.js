
/**
 * Busca os servicos pela situacao
 */
pageCartoes = function(){
	mainView.router.loadPage('cartoes.html');
	buscaCartoes();
}

buscaCartoes = function(tp, callback){
	
	var idusuario = localStorage.getItem("idusuario"); 
	
	$.ajax({
		url: ambiente+"/admin/restcartoes/busca",
		method: "GET",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    data: {
	    	idusuario : idusuario,
	    },
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');
	    },
	}).done(function (data2, status, jqXHR) {  
		
		if(tp == 1){
			var container = "#divFcartoes";
			var classe    = "forma-cartao";
		}else{
			var container = "#divLcartoes";
			var classe	  = "cartoes";
		}
		
		var data = data2;
		
		if(status == "success"){ 
			if(data.erro !== undefined){
				myApp.alert("Erro ao buscar os cartões!","Atenção!");
				if(typeof callback === 'function' && callback()) callback(false);
				
				myApp.hidePreloader(); 
			}else{
					
				if(data.sucesso !== undefined){ 
					
					$("#divLcartoes").html("");
					$("#divLcartoes").hide();
					$("#divNocartoes").css("display", "block");
					
					myApp.hidePreloader();
					
				}else{ 
					
					if(data.cartoes.length > 0){
						$("#novoCartao").html("Novo cartão de crédito");
					}
					
					$("#divLcartoes").html("");
					$("#divFcartoes").html(""); console.log(data);
					
					for(var i = 0; i<data.cartoes.length; i++){
						
						var icon = "fa-cc";
						
						if(data.cartoes[i].bandeira == 'visa') icon = 'fa-cc-visa'; 
						else if(data.cartoes[i].bandeira == 'mastercard') icon = 'fa-cc-mastercard';
						else if(data.cartoes[i].bandeira == 'amex') icon = 'fa-cc-amex';
						else if(data.cartoes[i].bandeira == 'diners') icon = 'fa-cc-diners-club';
						
						var pad = "******************************";
						var tam = 30 - (data.cartoes[i].numerocartao.length - 8);
						
						var cartao = data.cartoes[i].numerocartao.substr(0,4) + pad.slice(tam) + data.cartoes[i].numerocartao.slice(-4);
												 
						$(container).append('<div class="row padding-bottom-20 full '+classe+'" data-id="'+data.cartoes[i].idcartaodecredito+'" data-numero="'+cartao+'" data-cartao="'+data.cartoes[i].numerocartao+'" data-validade="'+data.cartoes[i].validade+'" data-bandeira="'+data.cartoes[i].bandeira+'" data-nome="'+data.cartoes[i].nome+'" data-cvv="'+data.cartoes[i].cvv+'">'+
					        '<div class="card full" style="border">'+
						      '<div class="card-content"> '+
						        '<div class="card-content-inner row">'+
						        	'<div class="col-20">'+
						        		'<i class="fa '+icon+'" aria-hidden="true"></i>'+
							        '</div>'+
						        	'<div class="col-80">'+
						        		'<span class="titulo">'+cartao+'</span><br>'+
						        		'<span class="desc">Liberação imediata após aprovação</span>'+
					        		'</div>'+						        
						        '</div>'+
						    '</div>'+  
					      '</div>'+
				        '</div>').show();
						
						$("#divNocartoes").css("display", "none");
					}
					
					myApp.hidePreloader()
				}
				
				if(typeof callback === 'function' && callback()) callback(true);
			}
		}
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.alert("Erro ao buscar os serviços!","Atenção!");
		if(typeof callback === 'function' && callback()) callback(false);
	    myApp.hidePreloader()
	});
}

$$(document).on('click', '.cartoes', function (e) {
	
	myApp.showPreloader('Aguarde...');
	
	mainView.router.loadPage('cartoesdetalha.html');
	
	var idcartaonumero 	= $(this).attr('data-id');
	var cartaonumero 	= $(this).attr('data-numero');
	var cartaonome 		= $(this).attr('data-nome');
	var cartaovalidade 	= $(this).attr('data-validade');
	var cartaocvv 		= $(this).attr('data-cvv');
	
	localStorage.setItem("idcartaoadetalha", idcartaonumero);
	 
	if(localStorage.getItem("page-cartoesdetalha") == 1){ // verifico se page jah foi carregado no DOM
		$("#cartaoDetnumero").html(cartaonumero); 
		$("#cartaoDettitular").html(cartaonome);
		$("#cartaoDetvalidade").html(cartaovalidade);
		$("#cartaoDetcvv").html(cartaocvv);	
	}else{
		myApp.onPageInit('cartoesdetalha', function (page) {
			localStorage.setItem("page-cartoesdetalha", 1);
			
			$("#cartaoDetnumero").html(cartaonumero); 
			$("#cartaoDettitular").html(cartaonome);
			$("#cartaoDetvalidade").html(cartaovalidade);
			$("#cartaoDetcvv").html(cartaocvv);			
		});
	}	
		
	myApp.hidePreloader();
	
});

/**
 * Remove cartao
 */
$$(document).on('click', '.btn-delcartao', function (e) {
	var idcartao = localStorage.getItem("idcartaoadetalha");
	
	myApp.confirm('Deseja remover o cartão?', function () {
		removeCartao(idcartao);
    });
});

removeCartao = function(idcartao){   	
	
	$.ajax({
		url: ambiente+"/admin/restcartoes/remove",
		method: "GET",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    data: {
	    	idcartao : idcartao,
	    },
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			if(data.erro !== undefined){
				myApp.hidePreloader();
				myApp.alert("Erro ao remover o cartão!","Atenção!");				
			}else{
				myApp.hidePreloader();
				
				myApp.alert("Cartão removido com sucesso!","Atenção!", function(){
					$(".btn-cartoes").trigger('click');		
				});
			}
		}
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.alert("Erro ao remover o cartão!","Atenção!");
		if(typeof callback === 'function' && callback()) callback(false);
	    myApp.hidePreloader()
	});	
}

/*-- listo cartoes --*/
$(".btn-pagamento").click(function(){
	
	mainView.router.loadPage('cartoes.html');
	
	if(localStorage.getItem("page-cartoes") == 1){ // verifico se page jah foi carregado no DOM
		buscaCartoes();	
	}else{
		myApp.onPageInit('cartoes', function (page) {
			localStorage.setItem("page-cartoes", 1)
			buscaCartoes();			
		});
	}	
});


/* cartoes-novo */
$$(document).on('click', '#cardNovocartao', function (e) {	
	console.log(2);
	
	mainView.router.loadPage('cartoes-novo.html');
});


$$(document).on('keyup', '#cartaonumeronovo', function (e) {
	
	var cartao = $(this).val();  
	
	if(cartao.length == 6){ 
		PagSeguroDirectPayment.getBrand({
			cardBin: cartao,
		    success: function(response) {
		    	console.log(response.brand.name);
		    	
		    	$("#novoIconecartao").removeClass().addClass("fa fa-cc-"+response.brand.name);
		    	
		    	//-- verifico a expiracao
		    	if(response.brand.expirable == true){
		    		$("#novoLivalidade").show();
		    	}else{
		    		$("#novoLivalidade").hide();
		    	}
		    	
		    	//-- guardo tipo de cartao
		    	localStorage.setItem("brand",  response.brand.name);
		    	
		    	$("#cartaonumeronovo").removeClass("border-red");		    	
				
		    	$("#btnProxnovocartao").removeClass('disabled');
		    },
		    error: function(response) {
		    	$("#cartaonumeronovo").addClass("border-red");
		    	
		    	myApp.hidePreloader();
				myApp.alert("Cartão inválido!","Atenção!");
				
				console.log(response);
				
				$("#btnProxnovocartao").addClass('disabled');
		    	
		    },
		    complete: function(response) {
		    	
		    }
		});
	}
});

/* cartaoes-novo2*/
$$(document).on('click', '#btnProxnovocartao', function (e) {	
	mainView.router.loadPage('cartoes-novo2.html');
});

/* valida campos obrigatorios da segunda tela*/
$$(document).on('keyup', '.require2', function (e) {
	var valida = 0;
	$('.require2').each(function(){
		if($(this).val() == ""){
			valida = 1;
		}
	});
	
	if(valida == 0){
		$("#btnProxnovocartao2").removeClass("disabled");
	}
});

/* cartaoes-novo3*/
$$(document).on('click', '#btnProxnovocartao2', function (e) {	
	mainView.router.loadPage('cartoes-novo3.html');	
});

myApp.onPageInit('cartoes-novo3', function(page){ 
	buscaEstados("cartaouf");	
});

/* valida campos obrigatorios da terceira tela */
$$(document).on('change', '.require3', function (e) {
	var valida = 0;
	$('.require3').each(function(){
		if($(this).val() == ""){
			valida = 1;
		}
	});
	
	if(valida == 0){
		$("#btnSalvarnovocartao").removeClass("disabled");
	}
});

/* cartaoes-novo3*/
$$(document).on('click', '#btnSalvarnovocartao', function (e) {	
	salvarCartao(function(r){
		if(r==true){
			
		}
	});
});

/* salvar cartao de credito */
//-- pagamento com cartao --
salvarCartao = function(callback){
	
	var dataNascimento = $("#cartaodtnascimento").val().split('-');
	dataNascimento = dataNascimento[2]+"/"+dataNascimento[1]+"/"+dataNascimento[0];
	
	$.ajax({
		url: ambiente+"/principal/cartoes/salvar",
		method: "POST",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');
	    },
	    data: {
	    	'cartaonome'			: $("#cartaotitular").val(),
        	'brand'					: localStorage.getItem('brand'),
        	'cartaocnpj'			: $("#cartaocpf").val(),
        	'cvv3'					: $("#cartaocvv").val(),
        	'cartaologradouro'		: $("#cartaologradouro").val(),
        	'cartaobairro'			: $("#cartaobairro").val(),
        	'cartaonumero'			: $("#cartaonumero").val(),
        	'cartaocep'				: $("#cartaocep").val(),
        	'cartaotelefone1'		: $("#cartaotelefone1").val(),
        	'cartaodatanascimento'	: "16/02/1983",
        	'idusuario'				: localStorage.getItem('idusuario'),
        	'cartaoidcidade'		: $("#cartaoidcidade").val(),
        	'validade'				: $("#cartaovalidade").val(),
        	'cartaocredito'			: $("#cartaonumeronovo").val(),
        	'cartaoemail'			: $("#cartaoemail").val(),
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success" && data.erro === undefined){

			var cartao = $("#cartaonumeronovo").val();
			
			var pad = "******************************";
			var tam = 30 - (cartao.length - 9);
			
			var cartao = cartao.substr(0,4) + pad.slice(tam) + cartao.slice(-4);
			
			localStorage.setItem('cartaoid', data.sucesso);
	    	localStorage.setItem('cartaomascara', cartao);
	    	localStorage.setItem('cartaonumero', $("#cartaonumeronovo").val());
			localStorage.setItem('cartaonome', $("#cartaotitular").val());
			localStorage.setItem('cartaovalidade', $("#cartaovalidade").val());
			localStorage.setItem('cartaocvv', $("#cartaocvv").val());
			localStorage.setItem('bandeira', localStorage.getItem('brand'));
			
			pagamentoCartao();
			
			myApp.hidePreloader();
		}else{
			
			myApp.hidePreloader();
		    myApp.alert("Não conseguimos salvar o cartão! Tente novamente.","Atenção!");
			
			callback(false);
		}		
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.hidePreloader();
	    myApp.alert("Não consegui gravar o cartão! Tente novamente.","Atenção!");    
	});
}