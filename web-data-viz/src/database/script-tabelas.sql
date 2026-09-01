-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE IF NOT EXISTS voltix;
USE voltix;

CREATE TABLE IF NOT EXISTS empresa(
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    cnpj CHAR(14) UNIQUE NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    razao_social VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nivel_permissao INT,
    senha VARCHAR(64),
    fk_empresa INT,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE IF NOT EXISTS maquina (
    id_maquina INT PRIMARY KEY AUTO_INCREMENT,
    nome_maquina VARCHAR(100) NOT NULL,
    sistema_operacional VARCHAR(50),
    total_memoria_ram DECIMAL(5, 2) NOT NULL,
    total_disco DECIMAL(7, 2) NOT NULL,    
    fk_empresa INT NOT NULL,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE IF NOT EXISTS leitura(
    id_leitura INT PRIMARY KEY AUTO_INCREMENT,
    horario_leitura DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_componente INT,
    FOREIGN KEY (fk_componente) REFERENCES componente(id_componente),
    fk_maquina INT NOT NULL,
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina)
);

CREATE TABLE IF NOT EXISTS codigo_ativacao(
    id_codigo INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(64),
    estado_codigo ENUM("ativado", "desativado")
);

CREATE TABLE IF NOT EXISTS componente(
    id_componente INT PRIMARY KEY AUTO_INCREMENT,
    nome_componente VARCHAR(15),
    unidade_medida VARCHAR(3)
);

CREATE TABLE IF NOT EXISTS maquina_componente(
    id_maquina_componente INT PRIMARY KEY AUTO_INCREMENT,
    fk_maquina INT,
    FOREIGN KEY (fk_maquina) REFERENCES maquina(id_maquina),
    fk_componente INT,
    FOREIGN KEY (fk_componente) REFERENCES componente(id_componente),
    parametro_componente DECIMAL(15,2),
    estado_componente ENUM("ativado", "desativado")
);