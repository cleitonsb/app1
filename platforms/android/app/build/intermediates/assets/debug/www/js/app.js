//-- cordova ------------------------------------
var app = {
    initialize: function() {
        this.bindEvents();
    },

 	// eventos para criacao do alert com tema do mobile ----
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

    onDeviceReady: function() {
        app.receivedEvent('deviceready');        
    },

    receivedEvent: function(id) {
          
    }
    
};

app.initialize();

//var ambiente = "http://limpar.local";
var ambiente = "https://contratar.limparonline.com.br";

// Carrega o F7
var myApp = new Framework7({
    modalTitle: 'Prime',
    material: true,
    pushState : true,
    cache : true,
	cacheIgnore : ['/cartoesdetalha'],
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar	: true,
    domCache: true
});

/*-- back button ---------------------- */
document.addEventListener("deviceready", appReady, false); 

function appReady(){ 
	document.addEventListener("backbutton", function(e){
		backPage();				 
	}, false); 
}

$$(document).on('click', '.btn-back', function () {
	backPage();
});

/*- ------------------------------------*/


myApp.onPageInit('servicos', function(page){ 
	myApp.params.swipePanel = 'right';
});

myApp.onPageInit('login', function(page){ 
	myApp.params.swipePanel = false;
	
	if(localStorage.getItem("lembrar") == 'on'){
		$("#loginemail").val(localStorage.getItem("loginemail"));
		$("#loginsenha").val(localStorage.getItem("loginsenha"));
		$("#lembrar").prop('checked', true);
	}
});


/* rotas --*/
$$(document).on('click', '#btnLogin', function(){
	mainView.router.loadPage('login.html');	
});

$$(document).on('click', '#btnCadastro', function(){
	mainView.router.loadPage('cadastro-step1.html');	
});

$$(document).on('click', '.btn-cartoes', function(){
	pageCartoes();
});

$(".btn-servicos").click(function(){ 
	buscaServicos();
});

$(".btn-dados").click(function(){ 
	pageUsuario();
});

$$(document).on('click', '.btn-close', function(){
	//mainView.router.back({ url: 'servicos.html', force: true});
	myApp.confirm("Deseja cancelar esse serviço?", "Cancelar", function(){
		buscaServicos();
	});	
});

//-- sair do app
$$(document).on('click', ".btn-sair", function(){
	localStorage.removeItem("sessao");
	mainView.router.loadPage('index.html');
	
	myApp.onPageInit('login', function (page) {	
		if(localStorage.getItem("lembrar") == 'on'){
			$("#loginemail").val(localStorage.getItem("loginemail"));
			$("#loginsenha").val(localStorage.getItem("loginsenha"));
			$("#lembrar").prop('checked', true);
		}
	});	
});

/**
 * Retorno das paginas
 */
backPage = function(){
	var d 		= myApp.getCurrentView().activePage;
	var page 	= d.container.attributes['data-back'].value;
	
	mainView.router.back({ url: page}); 
	
	console.log(page);
}

$$(document).on('click', ".btn-func", function(){
	var func = $(this).attr('data-func');
	
	console.log($(".pages [data-page=cartoes]"));
	
	myApp.hidePreloader();
	
	/*if(func = 'buscaCartoes') pageCartoes();
	if(func = 'buscaServicos') buscaServicos();*/
});
