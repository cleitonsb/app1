 $(document).ready(function () {
     
	 $$(document).on('click', '#btnStep1', function (e) {
		 validaCampos("#formCadastro1", function(r){
			 if(r==true){
				 mainView.router.loadPage('cadastro-step2.html');
			 }
		 });
		 
	 });
	 	 
	 $$(document).on('click', '#btnStep2', function (e) {
		 validaCampos("#formCadastro2", function(r){
			 if(r==true){
				 mainView.router.loadPage('cadastro-step3.html');				 				 
			 }
		 });		 
	 });
	 	
     /**
	 * Salva cadastro
	 */
	 $$(document).on('click', '#btnSalvar', function (e) {
		 validaCampos("#formCadastro3", function(r){
			 if(r==true){
				 
				 $.ajax({
					 url: ambiente+"/admin/restusuarios/salvar",
					 method: "POST",
					 asysnc: false,
					 cache: false,
					 dataType: "json",
					 data: {
						 cnpj			: $("#cnpj").val(),
						 ie				: $("#ie").val(),
						 fantasia		: $("#fantasia").val(),
						 razaosocial	: $("#razaosocial").val(),
						 cep			: $("#cep").val(),
						 uf				: $("#uf").val(),
						 cidade			: $("#cidade").val(),
						 bairro			: $("#bairro").val(),
						 logradouro		: $("#logradouro").val(),
						 numero			: $("#numero").val(),
						 contato		: $("#contato").val(),
						 telefone1		: $("#telefone1").val(),
						 email			: $("#email").val(),
						 senha			: $("#senha").val(),
					 },
					 beforeSend: function(){
						 myApp.showPreloader('Aguarde...');
					 },
				 }).done(function (data, status, jqXHR) {
					 if(data.erro !== undefined){
						 myApp.hidePreloader();
						 myApp.alert("Erro ao salvar o cadastro! Tente novamente.","Atenção!", function(){
							 mainView.router.back({ url: 'index.html'})
						 });
					 }else{
						 myApp.hidePreloader();
						 
						 localStorage.setItem("idusuario", data.idusuario);
						 $("#userNome").html($("#contato").val());
						 
						 myApp.alert("Cadastro realizado com sucesso!","Atenção!", function(){
							 
							 localStorage.setItem("loginemail", $("#email").val());
							 localStorage.setItem("loginsenha", $("#senha").val());
							 localStorage.setItem("lembrar", 1);
							 
							 buscaServicos(); 
						 });		    		
					 }
				 }).fail(function (jqXHR, status) {
					 console.log(status);
					 console.log(jqXHR.status);
					 
					 myApp.hidePreloader();
					 myApp.alert("Erro ao tentar se conectar ao servidor!","Atenção!");
				 });	
			 	 
			 }
		 });
	});	 
});
 
pageUsuario = function(){
	mainView.router.loadPage('cadastro-detalha.html');	
	buscaUsuario();
}
 
buscaUsuario = function(){
	$.ajax({
		 url: ambiente+"/admin/restusuarios/buscausuario",
		 method: "POST",
		 asysnc: false,
		 cache: false,
		 dataType: "json",
		 data: {
			 idusuario	: localStorage.getItem('idusuario'),
		 },
		 beforeSend: function(){
			 mainView.router.loadPage('cartoes.html');
			 myApp.showPreloader('Aguarde...');
		 },
	 }).done(function (data, status, jqXHR) {
		 if(data.erro !== undefined){
			 myApp.hidePreloader();
			 myApp.alert("Erro ao buscar os dados! Tente novamente.","Atenção!", function(){
				 buscaServicos();
			 });
			 
		 }else{
			 
			 console.log(data);
			 
			 $("#dadosCnpj").html(data.cnpj);
			 $("#dadosIe").html(data.ie);
			 $("#dadosFantasia").html(data.fantasia);
			 $("#dadosRazaosocial").html(data.razaosocial);
			 $("#dadosCep").html(data.cep);
			 $("#dadosUf").html(data.uf);
			 $("#dadosCidade").html(data.cidade);
			 $("#dadosBairro").html(data.bairro);
			 $("#dadosLogradouro").html(data.logradouro);
			 $("#dadosNumero").html(data.numero);
			 $("#dadosContato").html(data.contato);
			 $("#dadosTelefone1").html(data.telefone1);
			 $("#dadosEmail").html(data.email);
			 
			 localStorage.setItem("dadosCnpj", data.cnpj);
			 localStorage.setItem("dadosIe", data.ie);
			 localStorage.setItem("dadosFantasia", data.fantasia);
			 localStorage.setItem("dadosRazaosocial", data.razaosocial);
			 localStorage.setItem("dadosCep", data.cep);
			 localStorage.setItem("dadosUf", data.uf);
			 localStorage.setItem("dadosCidade", data.cidade);
			 localStorage.setItem("dadosBairro", data.bairro);
			 localStorage.setItem("dadosLogradouro", data.logradouro);
			 localStorage.setItem("dadosNumero", data.numero);
			 localStorage.setItem("dadosContato", data.contato);
			 localStorage.setItem("dadosTelefone1", data.telefone1);
			 localStorage.setItem("dadosEmail", data.email);	
			 
			 myApp.hidePreloader();
		 }
	 }).fail(function (jqXHR, status) {
		 console.log(status);
		 console.log(jqXHR.status);
		 
		 myApp.hidePreloader();
		 myApp.alert("Erro ao tentar se conectar ao servidor!","Atenção!");
		 
		 callback(false);
	 });
}