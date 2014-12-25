<?php

/**
 * Arquivo responsável por receber requisições e
 * apartir disso tomar decisões (Controller) do padrão
 * de projetos MVC para as operações básicas de
 * listar e excluir para as músicas já cadastradas
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
 
 // Define a variável $action para não ser exibido um warning ((...) Index action is not defined)
 $action = $_GET['action'];
 
$dao = new ConcreteDao();

 switch ($action) {
 	 // Retorna todos as múscias existentes
     case 'list' :
         
		 echo json_encode($dao->listar());
         break;
     
	 // Retorna todos os estilos existentes
	 case 'style' :
		 echo json_encode($dao->estilos());
	 	break;
	 
	 // Retorna true caso uma linha seja excluida com sucesso	
	 case 'delete' :
		 echo json_encode($dao->deletar());
		 break;
	 
	 //	Retorna todas as músicas existentes em um determinado estilo 	
	 case 'playlist' :
		 echo json_encode($dao->musicas());
		 break;	 
     default:
         
         break;
 }