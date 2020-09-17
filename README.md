# PRC-Projeto
Projeto final da UC de PRC

A aplicação desenvolvida para este projeto foi denominada de Music Sharing e tem como principal propósito a distribuição de informação acerca de álbuns de música dos mais variados de géneros e de todos os intervenientes nas suas conceções.

<a href="https://drive.google.com/drive/folders/1whq3kO6ioJoGyuynbg16v8eqHmObEAhh">Aqui</a> encontra-se alguma informação necessária para o funcionamento e compreensão da aplicação que não se encontra neste repositório. Estes ficheiros são:
<ul>
  <li>ontology.ttl: ficheiro em formato Turtle que contém a estrutura da ontologia.</li>
  <li>povoamento.ttl: ficheiro em formato Turtle que contém o povoamento da ontologia e, por conseguinte a informação armazenada no GraphDB.</li>
  <li>Processamento e Representação de Conhecimento.pptx: Pequeno PowerPoint elaborado acerca da aplicação.</li>
  <li>users.json: pequeno povoamento que contém informação de utilizadores fictícios para ser importado pelo MongoDB. </li>
</ul>

Foi também elaborado um pequeno <a href="https://github.com/josezitopedrito/PRC-Projeto/blob/master/projeto/PRC.pdf">relatório</a> que descreve de forma muito sucinta as funcionalidades da aplicação e como esta foi efetuada.

As tecnologias principais que esta aplicação utiliza são:
<ul>
  <li><a href="https://protege.stanford.edu/">Protégé</a>: Para definir a ontologia em que o povoamento desta aplicação se baseia.</li>
  <li><a href="http://graphdb.ontotext.com/">GraphDB</a>: Base de dados da aplicação, relativamente ao seu conteúdo musical.</li>
  <li><a href="https://www.mongodb.com/">MongoDB</a>: Base de dados da aplicação, relativamente à informação pertencente aos seus utilizadores.</li>
  <li><a href="https://nodejs.org/en/">NodeJS</a>: Framework utilizada para a realização da API de dados.</li>
  <li><a href="https://vuejs.org/">VueJS</a>: Framework utilizada para a realização da interface.</li>
 </ul>
