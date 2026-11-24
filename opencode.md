# Voltix

## Sobre o projeto

A Voltix é uma plataforma de monitoramento e observabilidade desenvolvida para acompanhar o desempenho da infraestrutura responsável pelo processamento e recebimento de dados de relógios inteligentes utilizados no monitoramento de energia.

Esses dispositivos coletam informações relacionadas ao consumo energético e enviam os dados para um sistema MDM (Mobile Device Management), responsável pelo gerenciamento e processamento dessas informações.

Entretanto, quando ocorre um grande volume de dados simultaneamente, o MDM pode sofrer sobrecarga, comprometendo seu desempenho e ocasionando a perda de informações enviadas pelos dispositivos.

Diante desse cenário, a Voltix surge como uma solução para monitorar a infraestrutura que sustenta esse processamento, permitindo acompanhar o comportamento dos servidores, identificar possíveis sobrecargas e antecipar situações que possam comprometer o recebimento e o processamento dos dados.


## Problema identificado

O monitoramento de energia por meio de relógios inteligentes depende do funcionamento adequado da infraestrutura responsável por receber e processar as informações coletadas.

Quando muitos dispositivos enviam dados ao mesmo tempo, o volume de requisições pode ultrapassar a capacidade de processamento do MDM, causando situações como:

- Sobrecarga da CPU e da memória RAM.
- Aumento da utilização dos recursos dos servidores.
- Instabilidade na comunicação de rede.
- Perda de pacotes durante a transmissão.
- Lentidão no processamento das informações.
- Possível perda de dados enviados pelos relógios inteligentes.

A falta de visibilidade sobre essas condições dificulta a identificação antecipada de problemas e pode comprometer a confiabilidade das informações de monitoramento energético.


## Objetivo

Desenvolver uma plataforma capaz de monitorar continuamente a infraestrutura do MDM, oferecendo informações sobre o desempenho dos servidores e permitindo identificar possíveis gargalos que possam prejudicar o processamento dos dados.

A Voltix busca:

- Acompanhar o desempenho dos servidores responsáveis pela infraestrutura do MDM.
- Monitorar o consumo de CPU, memória RAM e disco.
- Acompanhar o tráfego de rede e a perda de pacotes.
- Identificar possíveis situações de sobrecarga.
- Gerar alertas quando as métricas atingirem condições que exigem atenção.
- Facilitar a análise preventiva da infraestrutura.
- Contribuir para a redução de perdas de dados causadas por problemas de desempenho.


## Funcionalidades


### Monitoramento de servidores

Permite acompanhar individualmente os servidores vinculados à infraestrutura do MDM, apresentando métricas como:

- **CPU:** percentual de utilização do processador.
- **Memória RAM:** percentual de memória utilizada.
- **Disco:** utilização do armazenamento.
- **Rede enviada:** quantidade de dados transmitidos.
- **Rede recebida:** quantidade de dados recebidos.
- **Perda de pacotes:** percentual de pacotes que não chegaram corretamente ao destino.

As informações são atualizadas automaticamente, possibilitando o acompanhamento contínuo do desempenho dos servidores.


### Sistema de alertas

Identifica condições que podem indicar problemas na infraestrutura, como utilização elevada de recursos e possíveis instabilidades.

Os alertas apresentam informações como servidor relacionado, descrição, prioridade e data de ocorrência, facilitando a identificação dos problemas pelos profissionais responsáveis.


### Gestão de servidores

Permite cadastrar e administrar as instâncias monitoradas, associando-as às respectivas empresas e organizando os componentes que serão acompanhados.


### Gestão de funcionários

Possibilita administrar os funcionários vinculados à empresa e seus respectivos acessos à plataforma.


### Gestão de códigos

Permite administrar os códigos de ativação utilizados no processo de vinculação e cadastro de instâncias.


## Perfis de acesso

- **Gestor de TI:** responsável pela administração da estrutura da empresa na plataforma, incluindo o gerenciamento de funcionários, servidores e códigos de ativação.
- **Analista NOC:** responsável pelo acompanhamento operacional da infraestrutura, análise das métricas dos servidores e identificação de alertas e possíveis falhas.


## Tecnologias utilizadas

- **HTML, CSS e JavaScript:** desenvolvimento da interface e funcionalidades do frontend.
- **Node.js:** desenvolvimento da API e gerenciamento das operações da aplicação.
- **MySQL:** armazenamento das informações de empresas, usuários, servidores, componentes, métricas e alertas.
- **Python:** coleta e organização das informações de monitoramento.
- **Amazon S3:** armazenamento e disponibilização dos arquivos JSON utilizados na apresentação dos dados do dashboard.
- **Chart.js:** construção de gráficos para visualização das métricas.


## Importância da solução

A Voltix busca contribuir para a confiabilidade do monitoramento energético realizado por meio de relógios inteligentes.

Ao acompanhar o desempenho da infraestrutura do MDM, a plataforma permite identificar possíveis gargalos antes que eles provoquem consequências mais graves, como a perda de informações transmitidas pelos dispositivos.

Dessa forma, a solução oferece maior visibilidade sobre a infraestrutura, auxilia os profissionais de TI na tomada de decisões e contribui para um ambiente de processamento mais estável e eficiente.
