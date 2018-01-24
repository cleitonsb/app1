$$(document).on('click', '#btnEntrar', function (e) {
	console.log(1);
	    	
	var usuario = $("#loginemail").val();
	var senha	= $("#loginsenha").val();
	var lembrar = $("#lembrar").val();
	
	console.log($("#lembrar").prop('checked'));
	
	if($("#lembrar").prop('checked') == true){
		localStorage.setItem("loginemail", usuario);
		localStorage.setItem("loginsenha", senha);
		localStorage.setItem("lembrar", lembrar);
	}else{
		localStorage.setItem("loginemail", "");
		localStorage.setItem("loginsenha", "");
		localStorage.setItem("lembrar", "");
	} 
	
	$.ajax({
		url: ambiente+"/login",
		method: "POST",
		asysnc: false,
		cache: false,
		dataType:  'json', 
	    data: {
	    	usuario : usuario,
	    	senha   : senha,
	    	lembrar : lembrar,
	    },
	    beforeSend: function(){
	    	myApp.showPreloader('Aguarde...');
	    },
	}).done(function (data, status, jqXHR) {
		
		myApp.hidePreloader();
		
		if(status == "success"){ 
			if(data.sucesso == "true"){
				console.log("sucesso");
				
				localStorage.setItem("idusuario", data.idusuario);
				localStorage.setItem("sessao", data.sessao);
				
				$("#userNome").html(data.nome);
				
				mainView.router.loadPage('servicos.html');
				
				buscaServicos();
				
			}else{
				
				myApp.hidePreloader();
									
				if(data.sucesso == "-1"){
					myApp.alert("Usuário incorreto","Atenção!");
				}else if(data.sucesso == "-3"){
					myApp.alert("Senha incorreta! Digite novamente.","Atenção!");
				}else{
					myApp.alert("Usuário ou senha incorreta!","Atenção!");
				}
				
				localStorage.removeItem("idusuario");
			}
		}else{
			myApp.hidePreloader();
			myApp.alert("Erro ao tentar se conectar ao servidor!","Atenção!");
		}
				    
	}).fail(function (jqXHR, status) {
		console.log(status);
	    console.log(jqXHR.status);
	    myApp.hidePreloader();
	    myApp.alert("Erro ao tentar se conectar ao servidor!","Atenção!");
	});	
});
    

$$(document).on('click', '#btnRecuperasenha', function (e) {
	console.log(1);
	    	
	var email = $("#recuperaemail").val();
	
	if(email == ""){
		myApp.hidePreloader();
	    myApp.alert("Favor preencher o seu email!","Atenção!");
	}else{
	
		$.ajax({
			url: ambiente+"/acesso/recuperasenha",
			method: "POST",
			asysnc: false,
			cache: false,
			dataType:  'json', 
		    data: {
		    	email : email,
		    },
		    beforeSend: function(){
		    	myApp.showPreloader('Aguarde...');
		    },
		}).done(function (data, status, jqXHR) {
			
			myApp.hidePreloader();
			
			if(status == "success"){ 
				if(data.sucesso == "true"){
					console.log("sucesso");
					myApp.hidePreloader();	
					myApp.alert("Uma mensagem com instruções sobre como recuperar sua senha foi enviado para o seu e-mail.","Atenção!", function(){
						mainView.router.back({ url: 'index.html'});
					});
				}else{
					
					myApp.hidePreloader();
					
					if(data.erro !== undefined){
						if(data.erro == "erro1"){
							myApp.alert("E-mail não encontrado!","Atenção!");		
						}else{
							myApp.alert("Ocorreu um erro ao buscar seu email! Tente novamente.","Atenção!");
						}						
					}
				}
			}else{
				myApp.hidePreloader();
				myApp.alert("Ocorreu um erro ao buscar seu email! Tente novamente.","Atenção!");
			}
					    
		}).fail(function (jqXHR, status) {
			console.log(status);
		    console.log(jqXHR.status);
		    myApp.hidePreloader();
		    myApp.alert("Erro ao tentar se conectar ao servidor!","Atenção!");
		});
	}
});
    
