<?php

/**
 * Classe que implementa o padrão de projetos singleton e
 * utiliza do PDO (PHP data objects) para realizar a conexão 
 * com o banco de dados.
 * 
 * obs: Utilizando PDO evitamos falhas de segurança como
 * SQL Injection (http://en.wikipedia.org/wiki/SQL_injection)
 * 
 * @package php.model
 * @author Matheus Marabesi
 * @see http://php.net/manual/fr/book.pdo.php
 * @version 1.0
 */

class Connection extends PDO
{
	/**
	 * A string de conexão obrigatória
	 * @var string
	 */
	private $dsn = 'mysql:host=localhost;charset=utf8;dbname=';
	
	/**
	 * Nome do usuário para conectar
	 * @var string
	 */
	private $username = 'root';
	
	/**
	 * Senha para o usuário conectar do banco de dados
	 * @var string
	 */
	private $password = '123456';
	
	/**
	 * O nome da base de dados que será conectado
	 * @var string
	 */
	private $database = 'audiohtml5';
	
	/**
	 * @var Object
	 */
	public static $instance = false;
	
	/**
	 * Em versões futuras é possível ao invés de fazer a conexão
	 * por atributos da própria classe, utilizar um arquivo de 
	 * configuração (db.conf) para ler as informações necessárias
	 */
	public function __construct()
	{
		parent::__construct($this->dsn . $this->database, $this->username, $this->password);
		
		// Seta o PDO para jogar um exceção sempre que houver um erro
		parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	
	/**
	 * Retorna uma instância do PDO para ser utilizada, caso 
	 * a mesma não exista é criada e retornada
	 * 
	 * @return Object PDO
	 */
	public static function getInstance()
	{
		try
		{
			if ( !self::$instance )
			{
				self::$instance = new Connection();
			}
		}
		catch (Exception $error) 
		{
			exit($error->getMessage());	
		}
		
		return self::$instance;
	}

}

?>