/**
 * Importante: Todos as funções referentes a javascript/jquery estão necesse
 * arquivo.
 * 
 * Ao carregar a página lista todos as músicas existentes e configura o
 * uploadfy.
 * 
 * @author Matheus Marabesi
 * @see http://jquery.com/
 * @see http://www.uploadify.com/
 * @see https://datatables.net/
 * @version 1.0
 */

$(document).ready(function() {
	$('#tb_songs').dataTable({
		'oLanguage' : {
			// Opções para traduzir do inglês(idioma padrão do plugin) para
			// português
			'sProcessing' : 'Processando...',
			'sLengthMenu' : 'Mostrar _MENU_ registros',
			'sZeroRecords' : 'Não foram encontrados resultados',
			'sInfo' : 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
			'sInfoEmpty' : 'Mostrando de 0 até 0 de 0 registros',
			'sInfoFiltered' : '(filtrado de _MAX_ registros no total)',
			'sInfoPostFix' : '',
			'sSearch' : 'Buscar:',
			'sUrl' : '',
			'oPaginate' : {
				'sFirst' : 'Primeiro',
				'sPrevious' : 'Anterior',
				'sNext' : 'Seguinte',
				'sLast' : 'Último'
			}
		}
	});

	// Inicia o uploadfy
	$('#vc_file').uploadifive({
		'method' : 'post',
		'swf' : '/js/uploadify/uploadify.swf',
		'uploadScript' : '/php/controller/Uploader.php',
		'queueID' : 'queue',
		'multi' : false,
		// Mudar o tamanho de acordo com o texto do botão
		'width' : 'auto',
		'buttonText' : 'Selecionar mp3 !',
		'removeCompleted' : true,
		// Adiciona os dados faltantes ao formulário
		'onAddQueueItem' : function() {
			/**
			 * O correto seria utilizar a propriedade formData como diz a
			 * documentação (http://www.uploadify.com/), porém no dado momento
			 * do upload não é lançado nenhum evento anterior para atualizar os
			 * dados existeste no formulário, então sempre irá valores núlos
			 * para o servidor para contornar isso é adicionado esse evento
			 * (onAddQueueItem) para que toda vez que seja adicionado um arquivo
			 * na fila seja atualizado os dados no formulário.
			 */
			this.data('uploadifive').settings.formData = {
				'vc_music' : $('#vc_music').val(),
				'lb_style' : $('#lb_style').val()
			};
		},
		'onQueueComplete' : function(uploads) {
			$('#vc_music').val('');
			clearTable();
			updateTable();
		}
	});

	// Busca os estilos de múscias disponíveis
	updateSelect();

	// Busca as múscias existentes
	updateTable();
});

/**
 * Busca a playlist de acordo com o id passado do
 * estilo musical
 */
$('#lb_style_player').on('change', function(){
	findPlaylist($(this).val());
});

/**
 * Para questões de alta performance essa função abaixo deve ser eliminada, e a
 * cada nova música enviada deverá ser incluida a linha na tabela
 */
var clearTable = function() {
	$('#tb_songs').dataTable().fnClearTable();
};

/**
 * Busca todas as músicas cadastradas
 */
var updateTable = function() {
	$.ajax({
		url : '/php/controller/Songs.php',
		dataType : 'json',
		data : {
			'action' : 'list'
		},
		success : function(data) {
			var table = $('#tb_songs').dataTable();
			for ( var i = 0; i < data.length; i++) {
				table.fnAddData([
					data[i].vc_music,
					data[i].vc_description,
					'<a href="/songs/' + data[i].vc_file + '" target="_blank">' + data[i].vc_file + '</a>',
					'<a href="javascript:erase(' + data[i].id_song + ');">Excluir</a>'
				]);
			}
		}

	});
};

/**
 * Limpa todos os dados da tabela e os carrega de novo
 */
var erase = function(id) {
	$.ajax({
		url : '/php/controller/Songs.php',
		dataType : 'json',
		data : {
			'action' : 'delete',
			'id' : id
		},
		type : 'GET',
		success : function(data) {
			clearTable();
			updateTable();
		}

	});
};

/**
 * Busca os estilos de múscias disponíveis e adiciona aos select as opções
 * disponíveis.
 * 
 * #lb_style : select responsável por relacionar o estilo com a música para
 * realizar o upload
 * 
 * #lb_style_player : select responsável por carregar todas as músicas de um
 * determinado estilo
 */
var updateSelect = function() {
	$.ajax({
		url : '/php/controller/Songs.php',
		dataType : 'json',
		data : {
			'action' : 'style'
		},
		success : function(data) {
			for ( var i = 0; i < data.length; i++) {
				var option = new Option(data[i].vc_description, data[i].id_style);
				$('#lb_style, #lb_style_player').append(option);
			}
		}

	});
};

/**
 * Busca todas as músicas pelo id do estilo passado
 * e as adiciona á lista de execução do player
 */
var findPlaylist = function(id) {
	var ul = $('#playlist');
	
	if (id != 'undefined' && id != '')
	{
		$.ajax({
			url : '/php/controller/Songs.php',
			dataType : 'json',
			data : {
				'action' : 'playlist',
				'id' : id
			},
			success : function(data) {
				ul.empty();
				for ( var i = 0; i < data.length; i++) {
					ul.append('<li class="playlist-item"><a href="/songs/' + data[i].vc_file +'">' + data[i].vc_music + '<a/></li>');
				}
				
				// Seta configurações padrões para o player
				player();
			}
		});
	}
	else
	{
		ul.empty();
	}
};

/**
 * Função com todas as configurações referentes ao 
 * player em HTML5, tocar, passar para a próxima música
 * e alterar as classes dos elementos.
 */
var player = function() {
	var audio = $('#player');
	var playlist = $('#playlist');
	var songs = playlist.find('li a');
	
	// Pausa caso haja alguma outra música tocando enquanto
	// o usuário muda de playlist
	audio[0].pause();
	
	// Toca a primeira música da lista automaticamente
	play(playlist.find('li a').first(), audio[0]);
	
	
	// Altera a função padrão do click no link
	playlist.find('li a').click(function(event){
		// Utiliza o preventDefault para que seja anulada a ação de ir para outra página
		event.preventDefault();
		play($(this), audio[0]);
	});
	
	// Função para ir para a próxima música existente na linha
	audio[0].addEventListener('ended', function(event){
		var nextSong = $('.active').next().children();
		play(nextSong, audio[0]);
	});
	
	function play(song, player) {
		player.src = song.attr('href');
		player.load();
		player.play();
		
		// Adiciona uma classe para saber qual som está ativo
		$('ul li').removeClass('active');
		song.parent().addClass('active');
	}
};