<?php

/**
 * Classe que implementa a InterfaceDAO para realizar
 * as ações de persistência e busca de dados com
 * o banco de dados
 * 
 * @package php.model
 * @author Matheus Marabesi
 * @see InterfaceDao
 * @version 1.0
 */

require 'InterfaceDao.php';
require 'Connection.php';

class ConcreteDao implements InterfaceDao
{
	
	/**
	 * String com o caminho para onde o arquivo
	 * deve ser enviado
	 * @var string
	 */
	private $caminho;
	
	/**
	 * Array com todas extensões permitidas
	 * @var array
	 */
	private $extensoesPermitidas = array('mp3');
	 
	public function __construct()
	{
		// Sempre adicionar uma barra "/" no final da string para que não haja erros
		$this->caminho = $_SERVER['DOCUMENT_ROOT'] . '/songs/';
	}
	
	/**
	 * Método que persiste os dados enviados do cliente
	 * 
	 * @param	void
	 * @see InterfaceDao::inserir()
	 * @return	array|boolean
	 */
	public function inserir()
	{
		// Armazena o nome do arquivo original
		$nomeOriginal = $_FILES['Filedata']['name'];
	    $arquivoTemporario = $_FILES['Filedata']['tmp_name'];
		
		// Armazena a extensão do arquivo
		$array = explode('.', $nomeOriginal);
		$extensao = end($array);
		
		/**
		 * Garante um nome único para o arquivo para evitar sobreescrever
		 * algum arquivo existente.
		 * 
		 * obs : setar no php.ini date.timezone caso contrário será exibido um warning
		 */
		$novoNome = md5('unique_salt' . time()) . '.' . $extensao;
			
	    if ( in_array($extensao, $this->extensoesPermitidas) )
	    {
	        if ( move_uploaded_file($arquivoTemporario, $this->caminho . $novoNome) )
			{
				$connection = Connection::getInstance();
				$query = $connection->prepare('INSERT INTO tb_song (vc_music, vc_file, tb_style_id_style) VALUES (?, ?, ?)');
				$result = $query->execute(array($_POST['vc_music'], $novoNome, $_POST['lb_style']));
				
				return $result;
			}
	    }
		
		return false;
	}
	
	/**
	 * Retorna todas as músicas no banco de dados
	 * com as respectivas relações com os estilos
	 * 
	 * @param void
	 * @see InterfaceDao::listar()
	 * @return array|string Retornará um array com os dados caso de 
	 * 						sucesso, e em caso de erro retornará string 
	 */
	public function listar()
	{
		try
		{
			$query = 'SELECT id_song, vc_description, vc_file, vc_music FROM tb_song ' .
					 'INNER JOIN tb_style ON tb_style_id_style = id_style ' .
					 'ORDER BY vc_music';
					 
			$conn = Connection::getInstance();
			$data = $conn->query($query, PDO::FETCH_ASSOC)->fetchAll();
			return $data;
		}
		catch (PDOException $error)
		{
			return $error->getMessage();
		}
	}
	
	/**
	 * Deleta um registro do banco de dados
	 * conforme o id passado
	 * 
	 * @param void
	 * @see InterfaceDao::deletar()
	 * @return array|string|boolean	Retornará um array com os dados caso de 
	 * 								sucesso, e em caso de erro retornará string de
	 * 								outro modo retornará boolean
	 */
	public function deletar()
	{
		try
		{
			$find = $this->buscar($_GET['id']);
			
			if ( is_array($find) )
			{
				$connection = Connection::getInstance();
				$query = $connection->prepare('DELETE FROM tb_song WHERE id_song = ?');
				$result = $query->execute(array($_GET['id']));
				unlink($this->caminho . $find['vc_file']);
			}
			else
			{
				$result = false;
			}
			return $result;
		}
		catch (PDOException $error)
		{
			return $error->getMessage();
		}
	}
	
	/**
	 * Retorna um registro de acordo com o id passado
	 * 
	 * @see InterfaceDao::buscar($id)
	 * @return array|string Retornará um array com os dados caso de 
	 * 						sucesso, e em caso de erro retornará string 
	 */
	public function buscar($id)
	{
		try
		{
			$connection = Connection::getInstance();
			$query = $connection->prepare('SELECT id_song, vc_file, vc_music, tb_style_id_style FROM tb_song WHERE id_song = ?');
			$query->execute(array($_GET['id']));
			
			return $query->fetch(PDO::FETCH_ASSOC);
		}
		catch (PDOException $error)
		{
			return $error->getMessage();
		}
	}
	
	/**
	 * Busca os estilos de músicas disponíveis
	 * e os retorna em um array
	 * 
	 * @param void
	 * @return array|string Retornará um array com os dados caso de 
	 * 						sucesso, e em caso de erro retornará string 
	 */
	public function estilos()
	{
		try
		{
			$query = 'SELECT id_style, vc_description FROM tb_style';
					 
			$conn = Connection::getInstance();
			$data = $conn->query($query, PDO::FETCH_ASSOC)->fetchAll();
			return $data;
		}
		catch (PDOException $error)
		{
			return $error->getMessage();
		}
	}
	
	/**
	 * Busca todas as músicas de acordo com o estilo passado
	 * 
	 * @param 	void
	 * @return	array|string Retornará um array com os dados caso de 
	 * 						sucesso, e em caso de erro retornará string 
	 */
	public function musicas()
	{
		try
		{
			$connection = Connection::getInstance();
			$query = $connection->prepare('SELECT id_song, vc_file, vc_music, tb_style_id_style FROM tb_song WHERE tb_style_id_style = ?');
			$query->execute(array($_GET['id']));
			
			return $query->fetchAll(PDO::FETCH_ASSOC);
		}
		catch (PDOException $error)
		{
			return $error->getMessage();
		}
	}
}
