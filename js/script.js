/**
 * When the page loads the list of music is shown and the configuration
 * of the uploadify is applied.
 * 
 * @author Matheus Marabesi
 * @see http://jquery.com/
 * @see http://www.uploadify.com/
 * @see https://datatables.net/
 * @version 1.0
 */
$(document).ready(function() {
	$('#tb_songs').dataTable({
		//'oLanguage' : {
			// options to use Portuguese (PT-br)
			//'sProcessing' : 'Processando...',
			//'sLengthMenu' : 'Mostrar _MENU_ registros',
			//'sZeroRecords' : 'Não foram encontrados resultados',
			//'sInfo' : 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
			//'sInfoEmpty' : 'Mostrando de 0 até 0 de 0 registros',
			//'sInfoFiltered' : '(filtrado de _MAX_ registros no total)',
			//'sInfoPostFix' : '',
			//'sSearch' : 'Buscar:',
			//'sUrl' : '',
			//'oPaginate' : {
			//	'sFirst' : 'Primeiro',
            //  'sPrevious' : 'Anterior',
            //  'sNext' : 'Seguinte',
            //  'sLast' : 'Último'
			//}
		//}
	});

	$('#vc_file').uploadifive({
		'method' : 'post',
		'swf' : '/js/uploadify/uploadify.swf',
		'uploadScript' : '/php/controller/Uploader.php',
		'queueID' : 'queue',
		'multi' : false,
		'width' : 'auto',
		'buttonText' : 'Select the mp3 !',
		'removeCompleted' : true,
		'onAddQueueItem' : function() {
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

	updateSelect();

	updateTable();
});

/**
 * Search the playlist according to the last id
 */
$('#lb_style_player').on('change', function(){
	findPlaylist($(this).val());
});

/**
 * For high performance issues this function below should be eliminated, and the
 * each new song submitted must be included in the line table instead
 */
var clearTable = function() {
	$('#tb_songs').dataTable().fnClearTable();
};

/**
 * Search all the songs
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
 * Erase all rows on the table and loads they again
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
 * Search the styles available and adds to select the options
 * 
 * #lb_style : used to select the mp3 file to be uploaded
 * 
 * #lb_style_player : Loads all songs from a category
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
 * Search all songs by the id of the last style
 * and adds them to the playlist
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
 * Function with all the settings related to
 * HTML5 player, play, skip to the next song
 * and change the classes of elements.
 */
var player = function() {
	var player = $('#player');
	var playlist = $('#playlist');
	var songs = playlist.find('li a');
	
    var audio = player[0];
	// Pause if any other music playing while the user changes playlist
	audio.pause();
	
	// Plays the first song of the list automatically
	play(playlist.find('li a').first(), audio);
	
	
	// Changes the default click behavior
	playlist.find('li a').click(function(event){
		// Uses preventDefault to be annulled the action of going to another page
		event.preventDefault();
		play($(this), audio);
	});
	
	// Function to go to the next existing music on playlist
	audio.addEventListener('ended', function(event){
		var nextSong = $('.active').next().children();
		play(nextSong, audio);
	});
	
	function play(song, player) {
		player.src = song.attr('href');
		player.load();
		player.play();
		
		// Adds a class to know what sound is active
		$('ul li').removeClass('active');
		song.parent().addClass('active');
	}
};