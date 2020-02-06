# WS Node Proxy

Lightweight proxy for rapid development.
A simple and easy to configure proxy.

## 1. Instalação

Após fazer clone, na pasta do projeto, execute o comando:
`npm i -g`

A flag `-g` indica que o pacote será instalado globalmente.

## 2. Como executar

`node-proxy` ou `node index.js`

### 2.1 Definição de args:

| arg     | valor padrão                | descrição            |
|---------|-----------------------------|----------------------|
| --port  | 8098                        | Porta do proxy       |
| --front | false                       | Frontend local       |

Exemplo:

`node-proxy --front --service`

Cria proxy na porta 8098 com rotas para o service e front local ( conforme definidos no arquivo de configuração ).

## 3. Configuração
Para adicionar novos serviços adicionar no arquivo de configuração. Ex:

```json
"service": {
    "path": "/api/v1/service",
    "replace": "/api/service",
    "target": "http://localhost:8088"
}
```

`service` = identificador do serviço (utilizada como argumento)
`path` = rota a ser alterada
`replace` = replace da rota
`target` = novo endereço ao ser enviado a request


O identificador `dev` é obrigatório no arquivo de conf.

## 4. Contribuindo

Solicitar acesso e abrir MR.

## 5. Autor

Victor Hugo Rohsig Silva
