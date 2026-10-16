-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE SCHEMA IF NOT EXISTS voltix;

USE voltix;


-- -----------------------------------------------------
-- EMPRESA
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS empresa (
    id INT NOT NULL AUTO_INCREMENT,
    cnpj CHAR(14) NOT NULL,
    razao_social VARCHAR(90),
    nome_fantasia VARCHAR(60),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME,
    deletado_em DATETIME,

    PRIMARY KEY (id),
    UNIQUE (cnpj)
);

CREATE TABLE IF NOT EXISTS especificacao (
    id INT NOT NULL AUTO_INCREMENT,
    componente_id INT NOT NULL,
    nome VARCHAR(120) NOT NULL,

    PRIMARY KEY (id),

    FOREIGN KEY (componente_id)
        REFERENCES componente (id)
);

CREATE TABLE IF NOT EXISTS instancia (
    id INT NOT NULL AUTO_INCREMENT,
    nome varchar(45),
    endereco_mac CHAR(12) NOT NULL,
    descricao TEXT NOT NULL,
    empresa_id INT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deletado_em DATETIME,
    status boolean default true,
    PRIMARY KEY (id),
    UNIQUE (endereco_mac),

    FOREIGN KEY (empresa_id)
        REFERENCES empresa (id)
);


-- -----------------------------------------------------
-- METRICA
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS metrica (
    id INT NOT NULL AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    especificacao_id INT NOT NULL,
    maximo DOUBLE(8,2),
    minimo DOUBLE(8,2),
    unidade_medida VARCHAR(20) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME,
    deletado_em DATETIME,

    PRIMARY KEY (id),

    FOREIGN KEY (instancia_id)
        REFERENCES instancia (id),

    FOREIGN KEY (especificacao_id)
        REFERENCES especificacao (id)
);


CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    cargo TINYINT NOT NULL,
    email VARCHAR(120) NOT NULL,
    senha BLOB NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME,
    deletado_em DATETIME,

    PRIMARY KEY (id),
    UNIQUE (email),

    FOREIGN KEY (empresa_id)
        REFERENCES empresa (id)
);

CREATE TABLE IF NOT EXISTS componente (
    id INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS alerta (
    id INT NOT NULL AUTO_INCREMENT,
    metrica_id INT NOT NULL,
    prioridade TINYINT NOT NULL,
    tipo VARCHAR(45),
    descricao TEXT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    enviado_em DATETIME,

    PRIMARY KEY (id),

    FOREIGN KEY (metrica_id)
        REFERENCES metrica (id)
);

CREATE TABLE IF NOT EXISTS codigo_ativacao (
    id INT NOT NULL AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    codigo CHAR(6) NOT NULL,
    cargo TINYINT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expira_em DATETIME NOT NULL,
    usado_em DATETIME,
    atualizado_em DATETIME,
    deletado_em DATETIME,

    PRIMARY KEY (id),
    UNIQUE (codigo),

    FOREIGN KEY (empresa_id)
        REFERENCES empresa (id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    cargo TINYINT NOT NULL,
    email VARCHAR(120) NOT NULL,
    senha BLOB NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME,
    deletado_em DATETIME,

    PRIMARY KEY (id),
    UNIQUE (email),

    FOREIGN KEY (empresa_id)
        REFERENCES empresa (id)
);

CREATE TABLE IF NOT EXISTS contato (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(45) NOT NULL,
    usuario_id INT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME,
    deletado_em DATETIME,

    PRIMARY KEY (id),

    FOREIGN KEY (usuario_id)
        REFERENCES usuario (id)
);
