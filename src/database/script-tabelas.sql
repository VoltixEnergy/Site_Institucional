-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

-- -----------------------------------------------------
-- BANCO DE DADOS VOLTIX
-- -----------------------------------------------------
#drop database voltix; 
 
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

INSERT INTO empresa (cnpj, razao_social, nome_fantasia)
VALUES (
    '12345678000199',
    'Empresa Teste LTDA',
    'Empresa Teste'
);

-- -----------------------------------------------------
-- INSTANCIA
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS instancia (
    id INT NOT NULL AUTO_INCREMENT,
    nome varchar(45),
    endereco_mac CHAR(17) NOT NULL,
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
-- COMPONENTE
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS componente (
    id INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- ESPECIFICACAO
-- -----------------------------------------------------

INSERT INTO especificacao (id, componente_id, nome) VALUES
(1, 1, 'cpu_use_percent'),
(2, 2, 'ram_total_percent'),
(3, 3, 'disk_free_percent'),
(4, 4, 'network_sent'),
(5, 4, 'network_received'),
(6, 4, 'package_drop_total');

CREATE TABLE IF NOT EXISTS especificacao (
    id INT NOT NULL AUTO_INCREMENT,
    componente_id INT NOT NULL,
    nome VARCHAR(120) NOT NULL,

    PRIMARY KEY (id),

    FOREIGN KEY (componente_id)
        REFERENCES componente (id)
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



SELECT   maximo as max, minimo as min, especificacao_id, instancia_id, e.nome as componente, 
i.nome as regiao, status
from metrica m
JOIN especificacao e ON m.especificacao_id = e.id
JOIN instancia i ON m.instancia_id = i.id
where i.empresa_id = 1 and i.nome
like 'SRV-01'
  AND i.deletado_em IS NULL
  AND m.deletado_em IS NULL;
  
  
select * from instancia;

SELECT
            u.id,
            u.nome,
            u.email,
            u.cargo,
            u.empresa_id
        FROM usuario u
        WHERE u.empresa_id = (
            SELECT empresa_id
            FROM usuario
            WHERE id = ?
        )
        AND u.nome LIKE ?
        AND u.deletado_em IS NULL
        ORDER BY u.nome;



-- -----------------------------------------------------
-- ALERTA
-- -----------------------------------------------------

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


-- -----------------------------------------------------
-- CODIGO DE ATIVACAO
-- -----------------------------------------------------

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

-- -----------------------------------------------------
-- USUARIO
-- -----------------------------------------------------

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


-- CONTATO
-- -----------------------------------------------------

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
SELECT * FROM empresa;
ALTER TABLE instancia
ADD COLUMN cenario ENUM(
'NORMAL',
'ACIMA_DA_MEDIA',
'ALTA_DEMANDA'
) DEFAULT 'NORMAL';
DESCRIBE instancia;
UPDATE instancia
SET cenario = 'NORMAL'
WHERE id = 1;
SELECT * FROM instancia;
INSERT INTO instancia (endereco_mac, descricao, empresa_id, cenario)
VALUES ('8CA982FD00CA', 'Servidor Principal', 1, 'NORMAL');
SELECT * FROM instancia;
SELECT USER();
CREATE DATABASE IF NOT EXISTS voltix;

-- 2. Atualiza a senha do usuário existente
ALTER USER 'aluno'@'%' IDENTIFIED BY 'Sptech#2024';

-- 3. Concede todas as permissões no banco voltix para o usuário
GRANT ALL PRIVILEGES ON voltix.* TO 'aluno'@'%';

-- 4. Aplica as alterações de permissões na memória
FLUSH PRIVILEGES;
SELECT CURRENT_USER();
INSERT INTO empresa (id, cnpj, nome_fantasia, razao_social) 
VALUES (1, '11111111111111', 'Voltix Energy', 'Voltix Energy Solucoes em Energia LTDA');

INSERT INTO usuario (id, nome, email, cargo, senha, empresa_id) 
VALUES (1, 'Administrador', 'adm@voltix.com', 1, SHA2('teste123', 256), 1);

select * from usuario;

-- -----------------------------------------------------
-- INSERINDO COMPONENTES
-- -----------------------------------------------------
INSERT INTO componente (id, tipo) VALUES
(1, 'CPU'),
(2, 'Memória RAM'),
(3, 'Disco Rigido'),
(4, 'Rede');

select * from componente;
-- -----------------------------------------------------
-- INSERINDO ESPECIFICAÇÕES DAS MÉTRICAS
-- -----------------------------------------------------
INSERT INTO especificacao (id, componente_id, nome) VALUES
(1, 1, 'cpu_use_percent'),
(2, 2, 'ram_total_gb'),
(3, 2, 'ram_free_gb'),
(4, 3, 'disk_free_percent'),
(5, 4, 'network_sent'),
(6, 4, 'network_received'),
(7, 4, 'package_drop_total');



ALTER TABLE instancia
ADD COLUMN cenario VARCHAR(30);

INSERT INTO instancia (
    endereco_mac,
    descricao,
    empresa_id,
    cenario
)
VALUES (
    '8CA982FD00CA',
    'Minha Maquina de Desenvolvimento',
    1,
    'NORMAL'
);

select * from instancia;

INSERT INTO metrica (instancia_id, especificacao_id, maximo, minimo, unidade_medida) VALUES
(4, 1, 100.00, 0.00, '%'),     -- cpu_use_percent
(4, 2, 64.00, 0.00, 'GB'),     -- ram_total_gb
(4, 3, 64.00, 0.00, 'GB'),     -- ram_free_gb
(4, 4, 100.00, 0.00, '%'),     -- disk_free_percent
(4, 5, 1000.00, 0.00, 'MB'),   -- network_sent
(4, 6, 1000.00, 0.00, 'MB'),   -- network_received
(4, 7, 100.00, 0.00, 'un');    -- package_drop_total


SELECT
    m.id AS metrica_id,
    i.id AS instancia_id,
    e.id AS especificacao_id,
    e.nome AS metrica_nome
FROM metrica m
JOIN especificacao e ON m.especificacao_id = e.id
JOIN instancia i ON m.instancia_id = i.id
WHERE i.id = 4
  AND i.deletado_em IS NULL
  AND m.deletado_em IS NULL;
  
  
  UPDATE instancia
SET
    cenario = 'NORMAL',
    quantidade_softwares = 5
WHERE id = 4;



