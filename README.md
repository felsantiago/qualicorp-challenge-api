<h2 align="center">

  <img alt="Qualicorp IT" src="https://res.cloudinary.com/dr05turuf/image/upload/v1614651925/qualicorp-icon-1_mfqdcl.png" width="200px" />
  <h1> Desafio Qualicorp IT 🚀 </h1>
</h2>

<center><h2>Javascript | NodeJs</h2></center>

## :mailbox_with_mail: Get in touch!

<p align="center">

  <a href="https://github.com/felsantiago" target="_blank" >
    <img alt="Github - Felipe Santiago" src="https://img.shields.io/badge/Github--%23F8952D?style=social&logo=github">
  </a>
  <a href="https://www.linkedin.com/in/felipe-santiago-a7706418a/" target="_blank" >
    <img alt="Linkedin - Felipe Santiago" src="https://img.shields.io/badge/Linkedin--%23F8952D?style=social&logo=linkedin">
  </a>
  <a href="mailto:fepuss@gmail.com" target="_blank" >
    <img alt="Email - Felipe Santiago" src="https://img.shields.io/badge/Email--%23F8952D?style=social&logo=gmail">
  </a>
  <a href="https://api.whatsapp.com/send?phone=5588997143829"
        target="_blank" >
    <img alt="Fale comigo no whatsapp - Felipe Santiago" src="https://img.shields.io/badge/Whatsapp--%23F8952D?style=social&logo=whatsapp">
  </a>
</p>

### Desafio proposta pela qualicorp

Foi utilizado NODEJS no backend e REACTJS no frontend, banco de dados foi utilizado mongoDB.

Utilizei boas práticas de programação, clean architecture, TDD, princípios de DDD e SOLID, testes unitários, teste de integração, design patterns (Composite, Factory, Use case, Singleton pattern)

## curl
POST create customer
```
curl --request POST \
  --url http://localhost:3003/api/customers \
  --header 'content-type: application/json' \
  --data '{
	"name": "Felipe",
	"email": "fepuss@gmail.com",
	"telephone": "88997143829",
	"cpf": "12345678905"
}'
```

PUT update customer
```
curl --request PUT \
  --url http://localhost:3003/api/customers/$id \
  --header 'content-type: application/json' \
  --data '{
	"name": "Test",
	"email": "fepuss@gmail.com",
	"telephone": "88997143829",
	"cpf": "12345678905"
}'
```

GET find by all customers
```
curl --request GET \
  --url http://localhost:3003/api/customers
```

GET find by id
```
curl --request GET \
  --url http://localhost:3003/api/customers/$id
```

DELETE find by id
```
curl --request DELETE \
  --url http://localhost:3003/api/customer/$id
```

## **:scroll: Screen**
### Frontend
![image](https://user-images.githubusercontent.com/52730086/109587817-7ccfec00-7ae6-11eb-9b4d-39d040514e48.png)

![image](https://res.cloudinary.com/dr05turuf/image/upload/v1614652522/qualicorp_jgkmcw.gif)

### Relatório de Testes
![image](https://user-images.githubusercontent.com/52730086/109588180-1ac3b680-7ae7-11eb-851a-76c6578653af.png)

### Teste geral
![image](https://user-images.githubusercontent.com/52730086/109588326-51013600-7ae7-11eb-9974-6730744b7c70.png)

### Teste unitário
![image](https://user-images.githubusercontent.com/52730086/109588434-7b52f380-7ae7-11eb-87a0-499b9f363175.png)

### Teste de integração
![image](https://user-images.githubusercontent.com/52730086/109588499-9c1b4900-7ae7-11eb-8aa4-8d1b7ad7518f.png)

### Teste CI
![image](https://user-images.githubusercontent.com/52730086/109588585-bfde8f00-7ae7-11eb-8984-df551d3feb29.png)

## **:computer: Tecnologias**

<ul>
<li>Node.js
</li>
<li>JavaScript
</li>
<li>API's
</li>
<li>Express
</li>
<li>HTTP
</li>
<li>Routes
</li>
<li>Middlewares
</li>
<li>GET, POST, PUT, DELETE,
</li>
<li>CRUD
</li>
<li>Data persistence
</li>
<li>MongoDB
</li>
<li>Git
</li>
<li>Github
</li>
<li>Docker
</li>
<li>DDD
</li>
<li>TDD
</li>
<li>Solid
</li>
<li>Clean Architecture
</li>
</ul>

Felipe Santiago
