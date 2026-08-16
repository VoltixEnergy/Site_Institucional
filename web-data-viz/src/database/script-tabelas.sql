-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

create database voltix;

USE voltix;

CREATE TABLE usuario (
  idUsuario INT NOT NULL primary key auto_increment,
  nome VARCHAR(45) NULL,
  email VARCHAR(100) NULL,
  senha VARCHAR(255) NULL
);

select * from usuario;