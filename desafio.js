//variavel da url da api
var url = 'https://private-7cf60-4youseesocialtest.apiary-mock.com/timeline';
//carrega o modulo https
var http = require("https");
//arrays
var category = [], title = [], thumbnail = [], description = [];
// Categoria escolhida
var categoryChoose = 'Entertainment';
// para saber se option ja foi carregado com as categorias
var optionReady = false;

/**
 *  faz a requisição json e alimenta a aplicação com os dados
 *  provenientes dessa consulta
 *  
 * @returns {void}
 */
getResponse = function () {

    http.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            //parse do json
            var response = JSON.parse(body);
            //pega todas as categorias
            response.forEach(addCategoryToArray);
            //pega o restantes dos dados
            response.forEach(addToArray);
            //cria o menu de categorias
            makeOptionCategory();

        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });

};

/**
 *  filtra as categorias
 * @param {object} obj
 * @returns {mixed}
 */
filterByCategory = function (obj) {
    if ('category' in obj && obj.category === categoryChoose) {
        return obj;
    } else {

        return false;
    }
};

/**
 * responsável por preencher as fotos e as descrições das mesmas
 * 
 * @param {element} element
 * @returns {void}
 */
addImageToPhotosArea = function (element) {

    var photosArea = document.getElementById('photos');
    var template = document.querySelector('#photo-template');
    template.content.querySelector('img').src = element.thumbnail;
    template.content.querySelector('img').setAttribute('data-name', element.title);
    template.content.querySelector('.title').innerHTML = element.title;

    template.content.querySelector('.description').innerHTML = element.description;
    var clone = window.document.importNode(template.content, true);
    photosArea.appendChild(clone);
};

/**
 * remove as imagens antigas para serem substituidas por outras
 * imagens de acordo com a categoria escolhida
 * 
 * @returns {void}
 */
removeImagePhotosArea = function () {
    //percorre por todos os elementos com a classe .photo
    var photosArea = document.querySelectorAll('.photo');
    //remove todos os elementos percorridos
    for (var i = 0; i < photosArea.length; i++) {
        photosArea[i].remove();
    }

};

/**
 * adiciona apenas as categorias a variavel global category
 * 
 * @param {element} element
 * @param {index} index
 * @param {array} array  
 * @returns {void}
 */
addCategoryToArray = function (element, index, array) {
    category.push(element.category);
};

/**
 * adiciona todos os dados exceto a categoria aos arrays globais
 * 
 * @param {element} element
 * @param {index} index
 * @param {array} array  
 * 
 * @return {void} 
 * 
 */
addToArray = function (element, index, array) {

    if (categoryChoose === element.category) {

        thumbnail.push(element.thumbnail);
        title.push(element.title);
        description.push(element.description);

        addImageToPhotosArea(element);
    }
};

/**
 * Popula o select com options de categorias
 * @returns {undefined}
 */
makeOptionCategory = function () {
    //remove valores duplicados no array
    category = removeDuplicate(category);
    //pega o elemento pelo id categoria
    var select = document.getElementById("categoria");
    //verifica se ja foi populado
    if (!optionReady) {
        //informa que sera populado
        optionReady = true;
        //faz o forEach de categorias
        category.forEach(function (element, index, array) {
            var option = document.createElement("option");
            option.text = element;
            option.value = element;
            select.appendChild(option);
        });

    }

};

/**
 * remove dados duplicados no array
 * 
 * @param {array} arr 
 * 
 * @returns {array}
 */
removeDuplicate = function (arr) {
    var unique_array = Array.from(new Set(arr));
    return unique_array;
};

/**
 * executa assim que a aplicação é executada
 * 
 * @returns {void}
 */
window.onload = function ()
{
    //adiciona um listener ao elemento categoria
    document.getElementById('categoria').onchange = changeEventHandler;
    //executa a função getResponse
    getResponse();
};

/**
 * função que executa quando uma categoria diferente e selecionada
 * 
 * @param {event} event
 * 
 * @return {void} 
 */
changeEventHandler = function (event) {
    //pega o valor da cagetoria escolhida
    categoryChoose = event.target.value;
    //remove as fotos antigas
    removeImagePhotosArea();
    //executa a função getResponse para renovar a tela com dados novos
    getResponse();
};
