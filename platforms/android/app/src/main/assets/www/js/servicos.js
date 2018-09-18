$(document).ready(function () {
    $$(document).on('click', '.btn-novoservico', function (e) {
    	buscaConfiguracoes(function(r){
    		if(r==true){
    			mainView.router.loadPage('servicos-step1.html');    			
    		}
    		
    		myApp.hidePreloader();
    	});		
	});
    
    $$(document).on('click', '#btnServicostep1', function (e) {
    	localStorage.setItem("area", $("#area").val());
    	localStorage.setItem("banheiros", $("#banheiros").val());
    	
    	mainView.router.loadPage('servicos-step2.html');
	});
    
    $$(document).on('click', '#btnSemanal', function (e) {
    	localStorage.setItem('tipocontrato', 2);
		mainView.router.loadPage('servicos-semanal.html');
	});
    
    $$(document).on('click', '#btnServicosemanal, #btnServicodiaria', function (e) {
		mainView.router.loadPage('servicos-turno.html');
	});
    
    $$(document).on('click', '#btnCalendario', function (e) {
    	localStorage.setItem('tipocontrato', 1);
		mainView.router.loadPage('servicos-diaria.html');
	});
    
    $$(document).on('click', '#btnServicodiaria', function (e) {
		mainView.router.loadPage('servicos-sucesso.html');
	});
    
    //-- dias de semana -----
    $$(document).on('click', '.dias-semana input', function (e) {
    	
    	var ddias = "";
    	var dddiasdesc = "";
    	$(".dias-semana input").each(function(){
    		if($(this).prop('checked')){
    			ddias = ddias+";"+$(this).val();
    			dddiasdesc = dddiasdesc + $(this).attr('data-data')+"<br>";
    		}
    	})
    	
    	if(ddias != ""){
    		localStorage.setItem('diasservico', ddias);
    		localStorage.setItem('diasservicodesc', dddiasdesc);    		    		
    	}else{
    		localStorage.setItem('diasservico', '');
    		localStorage.setItem('diasservicodesc', '');
    	}
    	
    	console.log(ddias);    	
    });
    
    //-- selecao de turno ----------
    $$(document).on('click', '#btnManha', function (e) {
    	localStorage.setItem('turno', 1);	
		mainView.router.loadPage('servicos-resumo.html');
    	
    	//salvaServico();
	});
    
    $$(document).on('click', '#btnTarde', function (e) {
    	localStorage.setItem('turno', 2);	
		mainView.router.loadPage('servicos-resumo.html');
    	
    	//salvaServico();
	});
    
    $$(document).on('click', '#btnDiainteiro', function (e) {
    	localStorage.setItem('turno', 3);	
		mainView.router.loadPage('servicos-resumo.html');
    	
    	//salvaServico();
	});
    
    $$(document).on('click', '#btnConcluirservico', function (e) {
    	salvaServico();
	});
    
});

buscaServicos = function(){ 
	
		 
	$(".pages [data-page=servicos]").remove();
	mainView.router.loadPage('servicos.html');
	
	myApp.showPreloader('Aguarde...'); 
	
	/*myApp.onPageInit('servicos', function (page) { console.log(idusuario);
		listaServicos(1, function(e){
			listaServicos(2, function(){
				myApp.hidePreloader();
			});
		});
	});*/
	
	listaServicos(1, function(e){
		listaServicos(2, function(){
			myApp.hidePreloader();
		});
	});
}

myApp.onPageInit('servicos-turno', function (page) {
	$("#horarioBtn").hide();
	$("#horarioRadio").show();
	
	buscaTurno();
});

myApp.onPageInit('servicos-resumo', function (page) {
	
	var area = localStorage.getItem('area');
	var totalArea = 0;
	
	if(area == 1) totalArea = "0-180";
	if(area == 2) totalArea = "181-360";
	if(area == 3) totalArea = "361-540";
	if(area == 4) totalArea = "541-720";
	if(area == 5) totalArea = ">721";
	
	$("#resArea").html(totalArea);
	$("#resBanheiro").html(localStorage.getItem('banheiros'));
	
	var tpcontrato = localStorage.getItem('tipocontrato');
	if(tpcontrato == "1"){ 
		tpcontrato = "Diária";
		
		var data = localStorage.getItem('dataselecionada');
		
		data = data.split("-");
		
		if (data[2].toString().length == 1) data[2] = "0"+data[2];
		if (data[1].toString().length == 1) data[1] = "0"+data[1];
		 
		data = data[2]+"/"+data[1]+"/"+data[0];
		
		$("#resQuando").html(data);
	}
	
	if(tpcontrato == "2"){
		tpcontrato = "Semanal";		
		$("#resQuando").html(localStorage.getItem('diasservicodesc'));
	}
	
	$("#resTipo").html(tpcontrato);
	
	var turno = localStorage.getItem('turno');
	if(turno == 1) turno = "Manhã"
	if(turno == 2) turno = "Tarde";
	if(turno == 3) turno = "Dia inteiro";
	
	$("#resTurno").html(turno);
	
	var valorArea = parseInt(area)*localStorage.getItem('areaporturno');
	
	$("#resValor").html("R$"+valorArea);
	
});

/**
 * Busca os servicos pela situacao
 */
listaServicos = function(tp, callback){   	
	var idusuario = localStorage.getItem("idusuario");
	
	$.ajax({
		url: ambiente+"/admin/restservicos/busca",
		method: "POST",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    data: {
	    	idusuario : idusuario,
	    	sit	      : (tp == 1) ? '1,2' : '3',
	    },
	    beforeSend: function(){
	    		    	
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			if(data.erro !== undefined){
				myApp.alert("Erro ao buscar os serviços!","Atenção!");
				if(typeof callback === 'function' && callback()) callback(false);
				
				myApp.hidePreloader();
			}else{
				
				if(tp == 1){
					$("#divAgendados").html("");
				}else{
					$("#divConcluidos").html("");
				}
				
				if(data.sucesso !== undefined){
					if(tp == 1){
						$("#divAgendados").hide();
						$("#divNoagendados").css("display", "block");
					}else{
						$("#divConcluidos").hide();
						$("#divNoconcluidos").css("display", "block");
					}
				}else{
					
					for(var i = 0; i<data.servicos.length; i++){
						
						var dataServico = (data.servicos[i].data !== null) ? data.servicos[i].data.split("-") : "";
						
						var pagamento = (tp == 1) ? '<span class="#999">Aguardando pagamento</span>' : '<span class="#999">Sem pagamento</span>';
						var icon 	  = '<i class="fa fa-info-circle" aria-hidden="true"></i>';
						
						if(data.servicos[i].sitpagamento == 3 || data.servicos[i].sitpagamento == 4){
							pagamento = '<span class="#4e9a06">Pago</span>';
							icon 	  = '<i class="fa fa-check-circle" aria-hidden="true"></i>'; 
						/*}else if(data.servicos[i].sitpagamento == 2){
							pagamento = '<span class="#4e9a06">Cortesia</span>';
							icon 	  = '<i class="fa fa-check-circle" aria-hidden="true"></i>';
						*/
						}else if(data.servicos[i].sit == 0){
							pagamento = '<span class="#a40000">Cancelado</span>';
							icon = '<i class="fa fa-minus-circle" aria-hidden="true"></i>';
						} 					
						
						if(tp == 1){
							
							$("#divAgendados").append('<li class="item-content"><a href="javascript:" data-id="'+data.servicos[i].idservico+'" class="item-link item-content servicos">'+
					          '<div class="item-media">'+icon+'</div>'+
					          '<div class="item-inner">'+
					            '<div class="item-title">#'+data.servicos[i].idservico+" "+dataServico[2]+'/'+dataServico[1]+'/'+dataServico[0]+'<br><span class="desc-pag">'+pagamento+'</span></div>'+
					            '<div class="item-after"></div>'+
					          '</div>'+
					        '</li>');
							
							$("#divAgendados").show();
							$("#divNoagendados").css("display", "none");
							
						}else{
							
							$("#divConcluidos").append('<li class="item-content"><a href="javascript:" data-id="'+data.servicos[i].idservico+'" class="item-link item-content servicos">'+
					          '<div class="item-media">'+icon+'</div>'+
					          '<div class="item-inner">'+
					          '<div class="item-title">#'+data.servicos[i].idservico+" "+dataServico[2]+'/'+dataServico[1]+'/'+dataServico[0]+'<br><span class="desc-pag">'+pagamento+'</span></div>'+
					            '<div class="item-after"></div>'+
					          '</div>'+
					        '</li>');
							
							$("#divConcluidos").show();
							$("#divNoconcluidos").css("display", "none");
						}
					}					
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

$$(document).on('click', '.servicos', function (e) {
	var idservico = $(this).attr('data-id');

	detalhaServico(idservico);
	
});

/**
 * Detalha o servico
 */
detalhaServico = function(idservico){   	
	$("#divServicoscartoes").hide();	
	$("#divServpag").hide();
	
	$.ajax({
		url: ambiente+"/admin/restservicos/detalha",
		method: "GET",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    data: {
	    	idservico : idservico,
	    },
	    beforeSend: function(){
	    	myApp.hidePreloader();
	    	
	    	myApp.showPreloader('Aguarde...');
	    	
	    	$("#servicoProfissionais").html("");
			$("#divProfissionais").hide();
			
			$("#servicoPagamentos").html("");
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			if(data.erro !== undefined){
				myApp.hidePreloader();
				myApp.alert("Erro ao detalhar o serviço!","Atenção!");				
			}else{
				
				localStorage.setItem('idservico', idservico);
				localStorage.setItem('servicovalor', data.servico.valor);
				
				var dataServico = data.servico.data.split("-"); 
				mainView.router.loadPage('servicosdetalha.html');
				
				//myApp.onPageInit('servicosdetalha', function (page) {
					$("#servicoDetalha .servicodata").html(dataServico[2]+'/'+dataServico[1]+'/'+dataServico[0]);	  
					$("#servicoDetalha .servicovalor").html("R$"+number_format(data.servico.valor,2,",","."));
					$("#servicoDetalha .servicoarea").html(data.servico.area+"mtrs²");
					$("#servicoDetalha .servicobanheiros").html(data.servico.banheiros);
					
					//-- profissionais ---
					if(data.colaboradores !== undefined){
						
						$("#divProfissionais").show();
						
						for(var i = 0; i<data.colaboradores.length; i++){
							$("#servicoProfissionais").append('<li><div class="item-content"><div class="item-inner"><div class="item-title">'+data.colaboradores[i].colaborador+' </div></div></div></li>');						
						}
					}
					console.log(data.servico.sit)
					//-- pagamentos
					if(data.servico.sit == "3"){
						$("#servicoPagamentos").html('Sem pagamento');
					}else if(data.servico.tppagamento == null){
						$("#servicoPagamentos").html('<a href="#" id="btnPagamento" class="button button-fill button-raised button-big">Realizar pagamento</a>');
					}else if(data.servico.tppagamento == 1){
					
						if(data.cartao !== undefined){

							// cartao de credito 
							var icon = "fa-cc";

							if(data.cartao.bandeira == 'visa') icon = 'fa-cc-visa'; 
							else if(data.cartao.bandeira == 'mastercard') icon = 'fa-cc-mastercard';
							else if(data.cartao.bandeira == 'amex') icon = 'fa-cc-amex';
							else if(data.cartao.bandeira == 'diners') icon = 'fa-cc-diners-club';
							
							var pad = "******************************";
							var tam = 30 - (data.cartao.numerocartao.length - 8);
							
							var cartao = data.cartao.numerocartao.substr(0,4) + pad.slice(tam) + data.cartao.numerocartao.slice(-4);
													
							$("#divServicoscartoes").html('<div class="row padding-bottom-20 full">'+
								'<div class="card full" style="border">'+
								'<div class="card-content"> '+
									'<div class="card-content-inner row">'+
										'<div class="col-20">'+
											'<i class="fa '+icon+'" aria-hidden="true"></i>'+
										'</div>'+
										'<div class="col-80">'+
											'<span class="titulo">'+cartao+'</span><br>'+
											'<span class="desc">Pagamento aprovado</span>'+
										'</div>'+						        
									'</div>'+
								'</div>'+  
							'</div>'+
							'</div>');
							
							$("#divServicoscartoes").show();
							$("#divServpag").hide();
						}
						
					}else if(data.servico.tppagamento == 2){
						$("#servicoPagamentos").html('Boleto');						
					}else{
						$("#servicoPagamentos").html('Sem pagamento');
					}
					
					
					myApp.hidePreloader();
					
				//});
				
				myApp.hidePreloader();
			}
		}
		
		myApp.hidePreloader();
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.alert("Erro ao buscar os serviços!","Atenção!");
		if(typeof callback === 'function' && callback()) callback(false);
	    myApp.hidePreloader()
	});	
}

buscaConfiguracoes = function(callback){    	
	$.ajax({
		url: ambiente+"/admin/restconfiguracoes/busca",
		method: "POST",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');	    	
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			myApp.hidePreloader();
			
			if(data.erro !== undefined){
				myApp.alert("Erro ao buscar os dados de configuração!","Atenção!");
				callback(false);
			}else{				
				
				localStorage.setItem("areaporturno", data.areaporturno);
				localStorage.setItem("descontorecorrente", data.descontorecorrente);
				localStorage.setItem("intervalomaximo", data.intervalomaximo);
				localStorage.setItem("intervalominimo", data.intervalominimo);
				localStorage.setItem("precoturno", data.precoturno);
				
				callback(true);
			}
		}
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.alert("Erro ao buscar os dados de configuração!","Atenção!");
		callback(false);
	});	
}

//-- salva servicos
salvaServico = function(callback){ 
	
	$.ajax({
		url: ambiente+"/principal/servicos/salvar",
		method: "POST",
		asysnc: false,
		cache: false,
	    dataType: "json",
	    data: {
	    	data			: localStorage.getItem('dataselecionada'),
			idusuario		: localStorage.getItem('idusuario'),
			area			: localStorage.getItem('area'),
			banheiros		: localStorage.getItem('banheiros'),
			turno			: localStorage.getItem('turno'),
			tipo			: localStorage.getItem('tipocontrato'),
			diasservico		: localStorage.getItem('diasservico'),
	    },
	    beforeSend: function(){
	    	myApp.hidePreloader();
	    	myApp.showPreloader('Aguarde...');
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			 if(data.erro !== undefined){ 
				 myApp.hidePreloader();
				 myApp.alert("Erro ao salvar o cadastro do serviço! Tente novamente.");	
			 }else{
				 
				 localStorage.setItem('idservico', data.sucesso);
				 detalhaServico(data.sucesso);
				 
				 myApp.hidePreloader();				 
			 }
		}
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.hidePreloader();
	});	
}

/**
 * Verifica o turno do servico
 */
buscaTurno = function(){   
	    	
	var area = localStorage.getItem('area');    	
	area = (isNaN(area) || area == "") ? 0 : area;
	
	var totalArea = parseInt(area)*localStorage.getItem('areaporturno');
	
	var areaporturno  = localStorage.getItem('areaporturno');
	
	//-- turno --
	if(parseInt(totalArea) > parseInt(areaporturno)){
		$("#horarioRadio").hide();
		$("#btnDiainteiro").show();
	}else{
		$("#horarioRadio").show();
		$("#btnDiainteiro").hide();
	}	
}
