## Project Dependencies

Javascript
* [JQuery] (http://jquery.com/): Library needed to support the below described

* [Uploadfy] (http://www.uploadify.com/): A library to upload multiple files to the server

* [DataTables] (https://datatables.net/): Library responsible for displaying the songs sent in a table with various features such as paging, sorting etc.

## Structure of project directories

```
+ - Root
| + - Css: all relating to styles sheets are in this folder
| + - Images: all images that are used by plug-ins and / or the css are in that folder
| + - Js: all js files including third-party libraries are in that folder
| + - Php: all .php files are in this folder
| + - Model: all files for persistence of data is in this folder
| + - Controller: files for features and meet requests
| + - Songs: uploaded files to upload is destined this folder
```

Note: For the upload to work perfectly 755 permission to the folder / songs

## PHP

* Php.ini: upload_max_filesize = 10M - limits the size of the mp3 file to 10mb
* [PDO] (http://php.net/manual/en/book.pdo.php)

## Server Options ([Apache] (http://www.apache.org/))

```
<VirtualHost audiohtml5: 80>
         ServerName audiohtml5
         ServerAdmin webmaster @ localhost
         DocumentRoot / your / directory
        
         # Customizes the error pages
         ErrorDocument 403 /403.html
         ErrorDocument 404 /404.html

         <Directory / your / directory>
                 DirectoryIndex index.html
         </ Directory>
        
         # Add this strict rule that is not possible
         # Access the browser URL and protect the implementation of core
         <Directory / your / directory / php>
                 Options -Indexes
         </ Directory>
        
         # Protects the directory where the files are sent
         <Directory / your / directory / songs>
                 Options -Indexes
         </ Directory>
         ErrorLog $ {} APACHE_LOG_DIR /error.log
         CustomLog $ {} APACHE_LOG_DIR /access.log combined
</ VirtualHost>
```

## MySQL Database

* To change the connection settings see the class [php/model/Connection.php](https://github.com/marabesi/audiohtml5php/blob/master/php/model/Connection.php)

```
CREATE TABLE IF NOT EXISTS `tb_style` (
   `id_style` int (3) NOT NULL AUTO_INCREMENT,
   `varchar vc_description` (10) NOT NULL,
   PRIMARY KEY (`id_style`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 AUTO_INCREMENT = 6;


INSERT INTO `tb_style` (` id_style`, `vc_description`) VALUES
(1, 'POP'),
(2, 'ROCK'),
(3, 'FUNK'),
(4, 'FORRÓ'),
(5, 'PODCAST');

CREATE TABLE IF NOT EXISTS `tb_song` (
   `id_song` int (3) NOT NULL AUTO_INCREMENT,
   `varchar vc_music` (100) NOT NULL,
   `varchar vc_file` (36) NOT NULL,
   `tb_style_id_style` int (3) NOT NULL,
   PRIMARY KEY (`id_song`)
   KEY `fk_tb_song_tb_style_idx` (` tb_style_id_style`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 AUTO_INCREMENT = 0;

ALTER TABLE `tb_song`
   ADD CONSTRAINT `fk_tb_song_tb_style` FOREIGN KEY (` tb_style_id_style`) REFERENCES `tb_style` (` id_style`) ON DELETE NO ACTION ON UPDATE NO ACTION;
```
