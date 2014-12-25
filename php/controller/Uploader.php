<?php

/**
 * Arquivo responsável por receber requisições e 
 * apartir disso tomar decisões (Controller) do padrão
 * de projeto MVC para o upload de arquivos
 * 
 * obs: Todos os retornos dessa classe (echos, prints etc)
 * devem ser em json, pois esse arquivo é usado exclusivamente
 * com requisições ajax que só aceitarão json como retorno
 * 
 * @package php.controller
 * @author Matheus Marabesi
 * @version 1.0
 */

require '../model/ConcreteDao.php';
 
// Verifica se houve uma requisição POST e se existe arquivos enviados
if ( !empty($_FILES) )
{
	$dao = new ConcreteDao();
	echo json_encode($dao->inserir());
}