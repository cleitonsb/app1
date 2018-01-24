/**
 * Pagamentos
 * - Inicia sessao
 * - Busca hash
 * - Boleto ou cartao
 * - Busca token cartão
 * - Reliza pagamento
 */

$(document).ready(function () {
	
    $$(document).on('click', '#btnPagamento', function (e) {
    	
    	$(".pages [data-page=servicos-pagamento]").remove();
    	mainView.router.loadPage('servicos-pagamento.html');
    	
    	/*if(localStorage.getItem("page-cartoes") == 1){ // verifico se page jah foi carregado no DOM
    		buscaCartoes();	
    	}else{
    		myApp.onPageInit('servicos-pagamento', function (page) {
    			localStorage.setItem("page-cartoes", 1)
    			buscaCartoes();			
    		});
    	}*/
    	
    	myApp.onPageInit('servicos-pagamento', function (page) {
			//localStorage.setItem("page-cartoes", 1)
			
			myApp.hidePreloader();
	    	myApp.showPreloader('Aguarde...');
	    	
			//-- inicial sessao
	    	sessaoPagamento(function(r){
	    		if(r==true){ 
	    			hashPagamento(function(r){
	    	    		if(r==true){    			
	    	    			buscaCartoes(1);
	    	    			myApp.hidePreloader();
	    	    		}else{
	    	    			myApp.hidePreloader();
	    	    			myApp.alert("Não consegui pegar a sessao para pagamento! Feche o app e tente novamente.","Atenção!");
	    	    		}
		    		});
	    		}else{
	    			myApp.hidePreloader();
	    			myApp.alert("Não conseguimos inicializar a sessão para pagamentos! Feche o app e tente novamente.","Atenção!");
	    		}
	    	})
		});
	});
    
    /*-- forma de pagamento selecionada*/
    $$(document).on('click', '.forma-cartao', function (e) {
    	
    	localStorage.setItem('cartaoid', $(this).attr('data-id'));
    	localStorage.setItem('cartaomascara', $(this).attr('data-numero'));
    	localStorage.setItem('cartaonumero', $(this).attr('data-cartao'));
		localStorage.setItem('cartaonome', $(this).attr('data-nome'));
		localStorage.setItem('cartaovalidade', $(this).attr('data-validade'));
		localStorage.setItem('cartaocvv', $(this).attr('data-cvv'));
		localStorage.setItem('bandeira', $(this).attr('data-bandeira'));
    	
    	pagamentoCartao();
	});
    
    //-- pagamento com cartao
    $$(document).on('click', '#btnPagcartao', function (e) {
    	
    	myApp.hidePreloader();
    	myApp.showPreloader('Aguarde...');
    	
		tokenCartao(function(r){ //gero o token do cartao
    		if(r==true){
    			realizarPagamento(); //gero a transacao    			
    		}else{
    			myApp.hidePreloader();
    			//myApp.alert("Cartão inválido!","Atenção!");
    			
    			buscaServicos();
    		}
    	});
    	  
	});
    
    //-- pagamento com boleto
    $$(document).on('click', '#btnPagboleto', function (e) {
    	
    	myApp.hidePreloader();
    	myApp.showPreloader('Aguarde...');
    	
		realizarPagamento(1);
    	  
	});
});

myApp.onPageInit('servicos-pagamento', function (page) {
	//localStorage.setItem("page-cartoes", 1)
	//buscaCartoes(1);			
});

sessaoPagamento = function(callback){
	$.ajax({
		url: ambiente+"/admin/pagseguro/sessao",
		method: "POST",
		asysnc: false,
		cache: false,
	    beforeSend: function(){
	    	
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			 if(data == 'erro'){ 
				 console.log(data);					 
				 callback(false);
			 }else{
				 data = $.parseXML(data);
		        	
				 xml = $( data ),
				 title = xml.find( "id" );
	        	
				 localStorage.setItem("session",  title.text());	        	
				 console.log(localStorage.getItem("session"));				 
				 callback(true);
			 }
		}else{
			callback(false);
		}
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    callback(false);
	});
}	

//-- busca meios de pagamento
hashPagamento = function(callback){
		
	PagSeguroDirectPayment.setSessionId(localStorage.getItem("session"));
	var senderHash = PagSeguroDirectPayment.getSenderHash();
	
	localStorage.setItem("senderHash",  senderHash);	
	console.log(senderHash);	
	callback(true);	
}

tokenCartao = function(callback){	
	
	var cartaonumero 	= localStorage.getItem('cartaonumero');
	var cartaovalidade  = localStorage.getItem('cartaovalidade');
	var bandeira 		= localStorage.getItem('bandeira');
	var servicovalor 	= localStorage.getItem('servicovalor');
	var cvv 			= localStorage.getItem('cartaocvv');
	
	cartaovalidade = cartaovalidade.split("/");
	
	/*console.log(cartaonumero);
	console.log(bandeira);
	console.log(servicovalor);
	console.log(cvv);
	console.log(cartaovalidade);*/
		
	PagSeguroDirectPayment.createCardToken({
	    cardNumber: cartaonumero,
	    brand: bandeira,
	    cvv: cvv,
	    expirationMonth: cartaovalidade[0],
	    expirationYear: "20"+cartaovalidade[1],
	    success: function(response) {
	        console.log(response.card.token);
	        localStorage.setItem("creditCardToken",  response.card.token);
	        
	        callback(true);
	    },
	    error: function(response) {
	    	console.log(response);
	    	
	    	callback(false);
	    },
	    complete: function(response) {
	    	
	    }
	});	
}

//-- pagamento com cartao --
realizarPagamento = function(tp){
	
	$.ajax({
		url: ambiente+"/admin/pagseguro/pagamento",
		method: "POST",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    beforeSend: function(){
	    	
	    },
	    data: {
	    	idservico 		   : localStorage.getItem('idservico'),
	    	idcartaodecredito  : localStorage.getItem('cartaoid'),
	    	senderHash  	   : localStorage.getItem('senderHash'),
	    	creditCardToken    : localStorage.getItem('creditCardToken'),
	    	tp				   : tp,
	    },
	}).done(function (data, status, jqXHR) {
		
		myApp.hidePreloader();
		
		if(status == "success"){ 
			if(data.erro !== undefined){ 
				myApp.alert(data.message,"Atenção!");
			 	 
			}else if(data.sucesso !== undefined){
				
				if(tp == 1){
					/*$("#metodoBoleto").html('<button type="button" class="btn btn-primary input-lg" id="btnImprimeboleto"><i class="fa fa-print" aria-hidden="true"></i> Imprimir boleto</button>');
					
					window.open(data.paymentLink);*/
					localStorage.setItem('paymentLink',data.paymentLink);
					
					//myApp.alert("","Pagamento realizado com sucesso!", function(){
					buscaServicos();
					//});
					
				}else{
				
					if(data.status == "3"){
						myApp.alert("Nós recebemos o seu pagamento. Obrigado por escolher os serviços da Prime.","Pagamento realizado com sucesso!", function(){
							buscaServicos();
						});
					}else{
						myApp.alert("Em breve você receberá um email assim que o seu pagamento for finalizado.","Pagamento em análise!", function(){
							buscaServicos();
						});
					}
				}
				
				console.log(data);		
						
			}else{ 
				console.log(data);
				myApp.alert("Erro desconhecido. Favor entrar em contato com o suporte da Prime pelo email contato@empresaprime.com.br.","Atenção!", function(){
					buscaServicos();
				});				 
			}			 
		}
		
		$("#loader").hide();
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.hidePreloader();
	    myApp.alert("Erro ao solicitar o pagamento a instituição financeira! Tente novamente.","Atenção!");    
	});
}

//-- monta a tela servicos-pagcartao 
pagamentoCartao = function(){
	mainView.router.loadPage('servicos-pagcartao.html');
	
	myApp.onPageInit('servicos-pagcartao', function (page) {
		
		var cartaonumero 	= localStorage.getItem('cartaomascara');
		var cartaovalidade  = localStorage.getItem('cartaovalidade');
		var bandeira 		= localStorage.getItem('bandeira');
		var servicovalor 	= localStorage.getItem('servicovalor');
		
		$("#cartaoTitulo").html(cartaonumero);
		$("#cartaoValidade").html(cartaovalidade);
		$("#cartaoBandeira").removeClass().addClass("fa fa-cc-"+bandeira);
		
		
		$(".servico-valor").html("R$"+number_format(servicovalor,2,",","."));
	});
}