##Dependências do projeto

Javascript
* [jQuery](http://jquery.com/): Biblioteca necessária para dar suporte as abaixo descritas

* [Uploadfy](http://www.uploadify.com/): Uma biblioteca para fazer o upload de vários arquivos para
o servidor

* [DataTables](https://datatables.net/) : 
Biblioteca responsável por exibir as músicas enviadas em uma tabela
com várias funcionalidades como paginação, ordenação etc

##Estrutura de diretórios do projeto

```
+-- Raiz
|  +-- css : todos os arquivos referente a estido estão nessa pasta
|  +-- images : todas imagens que são utilizadas por plug-in's e/ou pelo css estão nessa pasta
|  +-- js : todos arquivos js incluindo bibliotecas de terceiros estão nessa pasta
|  +-- php : todos os arquivos .php estão nessa pasta
|      +-- model : todos arquivos referentes a persistencia de dados estão nessa pasta
|      +-- controller : arquivos referentes a funcionalidades e que atendem requisições
|  +-- songs : os arquivos enviados para upload tem como destino essa pasta
```

Obs: Para que o upload funcione perfeitamente de a permissão 755 para a pasta /songs

##PHP

* php.ini : upload_max_filesize = 10M - limita o tamanho do arquivo mp3 para 10mb
* [PDO](http://php.net/manual/en/book.pdo.php)

##Opções do servidor ([Apache](http://www.apache.org/))

```
<VirtualHost audiohtml5:80>
        ServerName audiohtml5
        ServerAdmin webmaster@localhost
        DocumentRoot /seu/diretorio
        
        # Customiza as páginas de erro
        ErrorDocument 403 /403.html
        ErrorDocument 404 /404.html

        <Directory /seu/diretorio>
                DirectoryIndex index.html
        </Directory>
        
        # Adiciona essa regra restrita para que não seja possível
        # acessar pela URL do browser e proteger o core da aplicação
        <Directory /seu/diretorio/php>
                Options -Indexes
        </Directory>
        
        # Protege o diretório onde os arquivos são enviados
        <Directory /seu/diretorio/songs>
                Options -Indexes
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

##Banco de dados MySQL

* Para alterar as configurações de conexão veja a classe [php/model/Connection.php](https://github.com/marabesi/audiohtml5php/blob/master/php/model/Connection.php)

```
CREATE TABLE IF NOT EXISTS `tb_style` (
  `id_style` int(3) NOT NULL AUTO_INCREMENT,
  `vc_description` varchar(10) NOT NULL,
  PRIMARY KEY (`id_style`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;


INSERT INTO `tb_style` (`id_style`, `vc_description`) VALUES
(1, 'POP'),
(2, 'ROCK'),
(3, 'FUNK'),
(4, 'FORRÓ'),
(5, 'PODCAST');

CREATE TABLE IF NOT EXISTS `tb_song` (
  `id_song` int(3) NOT NULL AUTO_INCREMENT,
  `vc_music` varchar(100) NOT NULL,
  `vc_file` varchar(36) NOT NULL,
  `tb_style_id_style` int(3) NOT NULL,
  PRIMARY KEY (`id_song`),
  KEY `fk_tb_song_tb_style_idx` (`tb_style_id_style`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=0 ;

ALTER TABLE `tb_song`
  ADD CONSTRAINT `fk_tb_song_tb_style` FOREIGN KEY (`tb_style_id_style`) REFERENCES `tb_style` (`id_style`) ON DELETE NO ACTION ON UPDATE NO ACTION;
```
