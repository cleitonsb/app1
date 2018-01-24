$(function(){

	montaCalendario = function(){
		
		myApp.showPreloader('Aguarde...');
		
		buscaFeriados(function(feriados){
			buscaServicoscadastrados(function(servicos){			
				
				desativados = (feriados == false) ? servicos : feriados.concat(servicos);
				var todayDate = new Date().getDate();
				
				calendario(desativados);
				myApp.hidePreloader();
			});
		});		
	}
	
	myApp.onPageInit('servicos-diaria', function (page) {
		montaCalendario();		
	});
	
	
});

/**
 * busco todos os servicos do intervalo, para fazer o bloquei das datas no calendario 
 */
buscaServicoscadastrados = function(callback){	
	$.ajax({
		url: ambiente+"/principal/servicos/validaexpediente",
		method: "GET",
		asysnc: false,
		cache: false,
	    dataType: "json",
	    data: {
	    	intervalo : 3,
	    },
	    beforeSend: function(){
	    		 
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			 if(data.erro !== undefined){ 
				 callback(false);
			 }else{
				 
				 var retorno = new Array();
				 for(var i = 0; i<data.length; i++){
					 
					 if(data[i].data !== null){
						 var arrData = data[i].data.split(" ");
						 arrData = arrData[0].split("-");
						 
						 //-- caso nao tenha colaborador disponivel
						 if(data[i].manha <= 0 && data[i].tarde <= 0){
							 retorno.push(new Date(arrData[0], arrData[1] - 1, arrData[2]));	 
						 }else{ //-- caso tenha colaborador disponivel
							 //var fcData = arrData[2]+'/'+arrData[1]+'/'+arrData[0];							 
						 } 
					 }
				 }
				 
				 callback(retorno);
			 }
		}
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    callback(false);
	});	
} 

//-- busca feriados -------------------
buscaFeriados = function(callback){
	
	$.ajax({
		url: ambiente+"/admin/feriados/busca",
		method: "POST",
		asysnc: false,
		cache: false,
	    dataType: "json",
	    data: {
	    	intervalo : 3,
	    },
	    beforeSend: function(){
	    	
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			 if(data.erro !== undefined){ 
				 callback(false);
			 }else{
				 
				 var retorno = new Array();
				 for(var i = 0; i<data.length; i++){
					 var arrData = data[i].data.split("-");
					 
					 retorno.push(new Date(arrData[0], arrData[1] - 1, arrData[2]));					 
				 }
				 
				 callback(retorno);
			 }
		}
		
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    callback(false);
	});	
}

/**
 * Verifico no dia selecionado quantos colaboradores estao disponiveis
 */
buscaDiaria = function(dataSel){
	
	var area = $("#area").val();
	
	if(area == ""){
		bootbox.alert({
			title: "Atenção",
			message: "Favor informar a área útil do seu estabelecimento!",
		});
	}else{
	
		$.ajax({
			url: ambiente+"/principal/servicos/validaexpedientediario",
			method: "GET",
			asysnc: false,
			cache: false,
		    dataType: "json",
		    data: {
		    	data : dataSel,
		    },
		    beforeSend: function(){
		    	$("#loader").show();
		    	
		    	$("#turno1").parent().removeClass( "disabled" );
		    	$("#turno2").parent().removeClass( "disabled" );	
		    	
		    	$("#turno1").prop( "disabled", false )
		    	$("#turno2").prop( "disabled", false )
		    },
		}).done(function (data, status, jqXHR) {
			
			if(status == "success"){ 
				 if(data.erro !== undefined){ 
					 bootbox.alert({
						title: "Erro!",
						message: "Não foi possível consultar a disponibilidade desse dia! Tente novamente.",
					 });
				 }else if(data.atencao !== undefined){ 
					 $("#valorData").html(dataSel);
					 localStorage.setItem('dataservico', dataSel);
				 }else{
					 console.log(data);
					 var areaporturno = parseInt(data.areaporturno);
					 
					 var turno = Math.ceil(area/areaporturno);
					 
					 var validaTurno = 0;
					 if(turno > parseInt(data.manha)){ //-- desativo botao manha
						 $("#turno1").prop( "disabled", true );
						 $("#turno1").parent().addClass( "disabled" );
						 
						 $("#turno2").attr('checked', 'checked');
						 $("#turno2").parent().addClass( "active" );
						 
						 $("#valorTurno").html("Vespertino");
						 
					 }else{
						 validaTurno = 1;
					 }
					 
					 if(turno > parseInt(data.tarde)){ //-- desativo botao tarde
						 $("#turno2").prop( "disabled", true );
						 $("#turno2").parent().addClass( "disabled" );
						 
						 $("#turno1").attr('checked', 'checked');
						 $("#turno1").parent().addClass( "active" );
						 
						 $("#valorTurno").html("Matutino");
						 
					 }else{
						 validaTurno = 1;
					 }
					 
					 if(validaTurno == 0){
						 bootbox.alert({
							title: "Atenção!",
							message: "Deslculpe, mas não temos colaboradores o suficiente para te atender nesse dia. Por favor, escolha outro dia.",
						 }); 
						 
						 $("#turno2, #turno1").prop( "checked", false );
						 $("#turno2, #turno1").parent().removeClass( "active" );
						 
						 $("#valorData").html("?");
						 $("#valorTurno").html("?");
						 
					 }else{
						 $("#valorData").html(dataSel);
						 localStorage.setItem('dataservico', dataSel);
					 }					 
				 }
				 
				 $("#area.check-campos").trigger('change');
			}
				
			$("#loader").hide();
		}).fail(function (jqXHR, status) {
			console.log(status);
		    console.log(jqXHR.status);
		    
		    $("#loader").hide();
		});
	}
} 

calendario = function(datasInativos){ 
	var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junio', 'Julio', 'Agosto' , 'Setembro' , 'Outubro', 'Novembro', 'Decembro'];
	var todayDate = new Date().getDate();
	
	var calendarInline = myApp.calendar({
	    container: '#ks-calendar-inline-container',
	    value: [new Date()],
	    weekHeader: true,
	    header: false,
	    footer: false,
	    disabled: datasInativos,
	    minDate: new Date(new Date().setDate(todayDate + parseInt(localStorage.getItem("intervalominimo")))),
		maxDate: new Date(new Date().setDate(todayDate + parseInt(localStorage.getItem("intervalomaximo")))),
	    toolbarTemplate:
	        '<div class="toolbar calendar-custom-toolbar">' +
	            '<div class="toolbar-inner">' +
	                '<div class="left">' +
	                    '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
	                '</div>' +
	                '<div class="center"></div>' +
	                '<div class="right">' +
	                    '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
	                '</div>' +
	            '</div>' +
	        '</div>',
	    onOpen: function (p) {
	        $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
	        $$('.calendar-custom-toolbar .left .link').on('click', function () {
	            calendarInline.prevMonth();
	        });
	        $$('.calendar-custom-toolbar .right .link').on('click', function () {
	            calendarInline.nextMonth();
	        });
	    },
	    onMonthYearChangeStart: function (p) {
	        $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
	    },
	    onChange: function(p, values, displayValues){
	    	var dia = values[0].getFullYear()+"-"+(values[0].getMonth()+1)+"-"+values[0].getDate();
            console.log(dia);
            
            localStorage.setItem("dataselecionada", dia);
        },
	});
	
}
