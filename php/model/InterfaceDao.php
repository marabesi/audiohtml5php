<?php

/**
 * Interface to use the DAO (Data Access Object) pattern
 * 
 * @package php.model
 * @author Matheus Marabesi
 * @see http://en.wikipedia.org/wiki/Data_access_object
 * @version 1.0
 */
interface InterfaceDao
{
	
	/**
	 * Insert the data
	 */
	public function inserir();
	
	/**
	 * Will fetch the data from the database.
	 * 
	 * This method will return a list without a filter or pagination
	 * which means it uses the eagle pattern instead of lazy. The dataTable.js
	 * takes care of the pagination
	 */
	 public function listar();
	 
	 /**
	  * Method used to delete a row in the database
	  */
	 public function deletar();
	 
	 /**
	  * Will fetch the data by its id in the database
	  */
	 public function buscar($id);
	 
}

?>
