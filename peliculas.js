var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjE0ZDc2NTUzZTI1NWYxYTY2YTQ2M2E5YWVlZjkzMCIsInN1YiI6IjY1M2Y3NThlY2M5NjgzMDBjOWU1MDEwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FqH5iyYw7QDd-7ZydOPSYQ2UH_hA4OcEeF6JUK-Iz3M");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//Crear una lista de películas
let miLista = [];

//Crea las variables para controlar el Scroll
let paginaActual = 1;
let paginasTotales = 1;

let categoriaActual = {
  id: 0,
  name: ""
}

//Genera las categorías cuando se inicia por primera vez

generarCategoriasJson();



//Comprueba que es posible hacer scroll. Si es posible lo hace para continuar mostrando resultados.
window.onscroll = function (ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

    if (paginaActual <= paginasTotales && categoriaActual.id > 0) {
      paginaActual++;
      generarPeliculasJson(categoriaActual, paginaActual);
    }
  }
  // scrollFunction();
};


//Obtiene las categorías de la api y llama al método generarBotones
function generarCategoriasJson() {
  paginaActual = 1;
  paginasTotales = 1;
  categoriaActual.id = 0;

  fetch("https://api.themoviedb.org/3/genre/movie/list?language=es", requestOptions)
    .then(response => response.json())
    .then(result => generarBotonesJSON(result))
    .catch(error => console.log('error', error));
}

//Genera automáticamente las categorías para el dropdown del menú "categorías"
function generaItemMenuCategorias(elemento) {
  padreCategorias = document.getElementById("menuCategorias");
  padreCategorias.classList.add("dropdown-menu");
  li = document.createElement("li");
  separador = document.createElement("li");
  hr = document.createElement("hr")
  hr.classList.add("dropdown-divider");
  a = document.createElement("a");
  a.classList.add("dropdown-item");
  a.innerHTML = elemento.name;

  //Al hacer clic en una categoría llama al método generarPeliculasJson
  a.addEventListener("click", function () {
    generarPeliculasJson(elemento, paginaActual);
  });


  padreCategorias.appendChild(li);
  li.appendChild(a);
  separador.appendChild(hr);
  padreCategorias.appendChild(separador);
}


//Crea botones con los resultados del método generarCategoríasJson
function generarBotonesJSON(resultados) {
  padre = document.getElementById("contenido");
  padreCategorias = document.getElementById("menuCategorias");
  padre.innerHTML = "";
  padreCategorias.innerHTML = "";
  titulo = document.createElement("h1");
  titulo.classList.add("mb-3", "margenTitulo", "text-center", "letraOscura")
  titulo.innerHTML = "Categorías";
  padre.appendChild(titulo);
  fila = document.createElement("div")
  fila.classList.add("row", "row-cols-2", "row-cols-md-3", "row-cols-lg-4", "justify-content-center")

  resultados.genres.forEach(elemento => {
    columna = document.createElement("div");
    columna.classList.add("col", "p-2");
    boton = document.createElement("button");
    boton.classList.add("btn", "botonCuadrado", "w-100", );
    atributo = document.createAttribute("type");
    atributo.value = "button";
    boton.setAttributeNode(atributo);
    imagen = document.createElement("img");
    imagen.src = `iconos/${elemento.id}.png`;
    imagen.classList.add("icono");

    atributoTitulo = document.createAttribute("title");
    atributoTitulo.value = elemento.name;
    boton.setAttributeNode(atributoTitulo);

    atributoAlt = document.createAttribute("alt");
    atributoAlt.value = elemento.name;
    boton.setAttributeNode(atributoAlt);


    p = document.createElement("p");
    p.classList.add("letraBlanca");
    p.innerHTML = `${elemento.name}`;

    //Al hacer clic en una categoría llama al método generarPeliculasJson
    boton.addEventListener("click", function () {
      generarPeliculasJson(elemento, paginaActual);
    });
    fila.appendChild(columna).appendChild(boton).appendChild(imagen);
    boton.appendChild(p);
    generaItemMenuCategorias(elemento);

  });
  padre.appendChild(fila);
}


//Genera las películas en función de la categoría y la página que queramos mostrar
function generarPeliculasJson(categoria, pagina) {
  categoriaActual.id=categoria.id;
  categoriaActual.name=categoria.name;
  fetch(`https://api.themoviedb.org/3/discover/movie?language=es&with_genres=${categoria.id}&page=${pagina}`, requestOptions)
    .then(response => response.json())
    .then(result => mostrarPeliculasCards(result, categoria))
    .catch(error => console.log('error', error));
}

function mostrarPeliculasCards(resultados, categoria) {
  paginasTotales = resultados.total_pages;
  padre = document.getElementById("contenido");

  if (paginaActual == 1) {
    padre.innerHTML = "";
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-2", "row-cols-md-3", "row-cols-lg-4", "justify-content-center");
    tituloPagina = document.createElement("h1")
    tituloPagina.classList.add("mb-4", "margenTitulo", "text-center");
    tituloPagina.innerHTML = "Películas de " + categoria.name;
    padre.appendChild(tituloPagina);
  }

  generarTarjetas(resultados);
  padre.appendChild(fila);
}


//Rellena la ventana modal que se encuenta en el archivo index.html en función de la película que se quiera mostrar
function cargarModal(elemento) {
  padreModal = document.getElementById("contenidoModal");
  padreModal.innerHTML = "";

  tarjetaPelicula = document.createElement("div");
  tarjetaPelicula.classList.add("card", "mb-3");
  imagenPelicula = document.createElement("img");
  imagenPelicula.src = `https://image.tmdb.org/t/p/original${elemento.backdrop_path}`;
  cuerpoTarjeta = document.createElement("div");
  cuerpoTarjeta.classList.add("card-body");
  tituloPelicula = document.createElement("h5");
  tituloPelicula.classList.add("card-title");
  tituloPelicula.innerHTML = elemento.title;
  descripcion = document.createElement("p");
  descripcion.classList.add("card-text");
  descripcion.innerHTML = elemento.overview;
  añoPelicula = document.createElement("p");
  añoPelicula.classList.add("card-text", "text-body-secondary");
  añoPelicula.innerHTML = `${elemento.release_date}`;

  padreModal.appendChild(tarjetaPelicula);
  tarjetaPelicula.appendChild(imagenPelicula);
  tarjetaPelicula.appendChild(cuerpoTarjeta);
  cuerpoTarjeta.appendChild(tituloPelicula);
  cuerpoTarjeta.appendChild(descripcion);
  cuerpoTarjeta.appendChild(añoPelicula);

  //Botón de la ventana modal para añadir un elemento, es decir una película, al array miLista
  botonLista = document.getElementById("añadirLista");
  botonLista.addEventListener("click", function () {
    añadirMiLista(elemento);
  });
}


//Comprueba que en la lista no exista el elemento y lo añade
function añadirMiLista(elemento) {
  if (!miLista.some(pelicula => pelicula.id === elemento.id)) {
    miLista.push(elemento);
  }
}

//Al hacer clic en la imagen lista del index.html, llama a esta función para mostrar las películas. 
function mostrarLista() {
  paginaActual = 1;
  paginasTotales = 1;
  categoriaActual.id=0;
  padreLista = document.getElementById("contenido");
  padreLista.innerHTML="";
  
  filaLista = document.createElement("div");
  filaLista.classList.add("row", "row-cols-2", "row-cols-md-3", "row-cols-lg-4", "justify-content-center");
  
  tituloPaginaLista = document.createElement("h1");
  tituloPaginaLista.classList.add("mb-4", "margenTitulo", "text-center");
  tituloPaginaLista.innerHTML = "Mi lista";
  padreLista.appendChild(tituloPaginaLista);

  miLista.forEach(elemento => {
    columna = document.createElement("div");
    columna.classList.add("col", "p-2");

    tarjeta = document.createElement("div");
    tarjeta.classList.add("card");

    imagen = document.createElement("img");
    imagen.src = `https://image.tmdb.org/t/p/w500${elemento.poster_path}`;
    imagen.classList.add("card-img-top");

    atributo = document.createAttribute("data-bs-toggle");
    atributo.value = "modal";
    imagen.setAttributeNode(atributo);

    atributo = document.createAttribute("data-bs-target");
    atributo.value = "#modalPelicula";
    imagen.setAttributeNode(atributo);

    atributoTituloImagen = document.createAttribute("title");
    atributoTituloImagen.value = elemento.title;
    imagen.setAttributeNode(atributoTituloImagen);

    atributoAltImagen = document.createAttribute("alt");
    atributoAltImagen.value = elemento.title;
    imagen.setAttributeNode(atributoAltImagen);

    imagen.addEventListener("click", function () {
      cargarModal(elemento);
    });

    bodyTarjeta = document.createElement("div");
    bodyTarjeta.classList.add("card-body");

    titulo = document.createElement("h6");
    titulo.classList.add("card-title");
    titulo.innerHTML = `${elemento.title}`;

    año = document.createElement("p");
    año.classList.add("card-text", "text-body-secondary", "mt-auto");
    año.innerHTML = `${elemento.release_date}`;

    filaLista.appendChild(columna);
    columna.appendChild(tarjeta);
    tarjeta.appendChild(imagen)
    tarjeta.appendChild(bodyTarjeta)
    bodyTarjeta.appendChild(titulo);
    bodyTarjeta.appendChild(año);
  });

  padreLista.appendChild(filaLista);
}

//Genera un result con los estrenos y llama al método mostrarEstrenos
function generarEstrenosJSON(){
  fetch("https://api.themoviedb.org/3/movie/now_playing", requestOptions)
  .then(response => response.json())
  .then(result => mostrarEstrenos(result))
  .catch(error => console.log('error', error));
}

//Muestra los estrenos en el div contenido
function mostrarEstrenos(resultados){
  paginaActual = 1;
  paginasTotales = 1;
  categoriaActual.id=0;
  padre = document.getElementById("contenido");
  padre.innerHTML = "";
  fila = document.createElement("div");
  fila.classList.add("row", "row-cols-2", "row-cols-md-3", "row-cols-lg-4", "justify-content-center");
  tituloPagina = document.createElement("h1")
  tituloPagina.classList.add("mb-4", "margenTitulo", "text-center");
  tituloPagina.innerHTML = "Estrenos";
  padre.appendChild(tituloPagina);

  generarTarjetas(resultados);
  
  padre.appendChild(fila);
}

//Genera las tarjetas de películas en función del result de películas que reciba el método
function generarTarjetas(resultados){

  resultados.results.forEach(elemento => {

    columna = document.createElement("div");
    columna.classList.add("col", "p-2");

    tarjeta = document.createElement("div");
    tarjeta.classList.add("card");

    imagen = document.createElement("img");
    imagen.src = `https://image.tmdb.org/t/p/w500${elemento.poster_path}`;
    imagen.classList.add("card-img-top");

    atributo = document.createAttribute("data-bs-toggle");
    atributo.value = "modal";
    imagen.setAttributeNode(atributo);

    atributo = document.createAttribute("data-bs-target");
    atributo.value = "#modalPelicula";
    imagen.setAttributeNode(atributo);

    atributoTituloImagen = document.createAttribute("title");
    atributoTituloImagen.value = elemento.title;
    imagen.setAttributeNode(atributoTituloImagen);

    atributoAltImagen = document.createAttribute("alt");
    atributoAltImagen.value = elemento.title;
    imagen.setAttributeNode(atributoAltImagen);

    imagen.addEventListener("click", function () {
      cargarModal(elemento);
    });

    bodyTarjeta = document.createElement("div");
    bodyTarjeta.classList.add("card-body");

    titulo = document.createElement("h6");
    titulo.classList.add("card-title");
    titulo.innerHTML = `${elemento.title}`;

    año = document.createElement("p");
    año.classList.add("card-text", "text-body-secondary", "mt-auto");
    año.innerHTML = `${elemento.release_date}`;

    fila.appendChild(columna);
    columna.appendChild(tarjeta);
    tarjeta.appendChild(imagen)
    tarjeta.appendChild(bodyTarjeta)
    bodyTarjeta.appendChild(titulo);
    bodyTarjeta.appendChild(año);
  });

}