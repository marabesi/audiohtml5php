<?php

/**
 * Interface para utilizar o padrão de projetos DAO
 * 
 * @package php.model
 * @author Matheus Marabesi
 * @see http://en.wikipedia.org/wiki/Data_access_object
 * @version 1.0
 */
interface InterfaceDao
{
	
	/**
	 * Método responsável por inserir dados
	 */
	public function inserir();
	
	/**
	 * Método responsável por retorna todos os dados
	 * existentes na tabela
	 * 
	 * obs : Esse padrão DAO contará também com a implementação
	 * do padrão eagle e não lazy para a recuperação dos dados
	 * pois o plugin utilizado (dataTable.js) já se encarrega de
	 * realizar a paginação.
	 */
	 public function listar();
	 
	 /**
	  * Método que excluir um registro persistido
	  * anteriormente na aplicação
	  */
	 public function deletar();
	 
	 /**
	  * Método que retorna um registro específico
	  * que é filtrado apartir do $id passado
	  */
	 public function buscar($id);
	 
}

?>