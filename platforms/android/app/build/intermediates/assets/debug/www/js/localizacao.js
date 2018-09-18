$(document).ready(function() {

	//-- busco o endereco pelo CEP
	$(document).on("keyup", ".cep", function(){
		var rad = $(this).attr('data-rad');
    	var cep = $(this).val();
    	cep = cep.replace("-","");
    	    	
    	if(cep.length >=8){
    		
			$.ajax({
				url: "http://viacep.com.br/ws/"+cep+"/json",
				method: "get",
				asysnc: false,
				cache: false,
				dataType:  'json', 
			    beforeSend: function(){
			    	myApp.showPreloader('Aguarde...');
			    },
			}).done(function (data, status, jqXHR) {
				
				if(status == "success"){ 
					$("#"+rad+"bairro").val(data.bairro);
					$("#"+rad+"logradouro").val(data.logradouro);
					$("#"+rad+"uf").val(data.uf);
					
					var selectCid = (rad) ? rad+"idcidade" : "";
					
					buscaCidades(data.uf, selectCid, data.localidade);
					
					if($("#cartaobairro").val() != ""){
						$("#btnSalvarnovocartao").removeClass("disabled");
					}
				}
				
				$("#loader").hide();
						    
			}).fail(function (jqXHR, status) {
				console.log(status);
			    console.log(jqXHR.status);
			    
			    $("#loader").hide();
			});
    	}
	});
	
	$(document).on("change", ".uf-select", function(){
		var uf 		= $(this).val();  
		var select 	= $(this).attr('data-id'); 
		
		buscaCidades(uf, select);
	});
    	
});

//-- busca de cidades 
buscaCidades = function(uf, selectCid, cidade){ 
	
	selectCid = (selectCid) ? "#"+selectCid : "#cidade";
	
	$.ajax({
		url: ambiente+"/admin/cidades/buscabyuf",
		method: "GET",
		asysnc: false,
		cache: false,
	    dataType: "json",
	    data: {
	    	uf : uf,
	    },
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			 if(data.erro !== undefined){ 
				 
			 }else{
				 for(var i = 0; i<data.length; i++){
					 var select = (cidade == data[i].nome) ? 'selected="selected"' : "";
					 $(selectCid).append('<option '+select+' value="'+data[i].idcidade+'">'+data[i].nome+'</option>')						 
				 }
			 }
			 
			 myApp.hidePreloader();
		}
		myApp.hidePreloader();
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.hidePreloader();
	});	
}

//-- busca de cidades 
buscaEstados = function(selectUf, uf){ 
	
	selectUf = (selectUf) ? "#"+selectUf : "#uf";
	
	$.ajax({
		url: ambiente+"/admin/estados/buscajson",
		method: "GET",
		asysnc: false,
		cache: false,
	    dataType: "json",
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');
	    },
	}).done(function (data, status, jqXHR) {
		
		if(status == "success"){ 
			 if(data.erro !== undefined){ 
				 
			 }else{
				 for(var i = 0; i<data.length; i++){
					 var select = (uf == data[i].nome) ? 'selected="selected"' : "";					 
					 $(selectUf).append('<option '+select+' value="'+data[i].uf+'">'+data[i].nome+'</option>')						 
				 }
			 }
		}
		
		myApp.hidePreloader();
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    
	    myApp.hidePreloader();
	});	
}

myApp.onPageInit('cadastro-step2', function(page){ 
	myApp.params.swipePanel = false;
	
	buscaEstados();	
});
