/*!
 * wjs-related v2.0.2
 * Copyright 2018 zkreations
 * Developed by José Gregorio (fb.com/JGMateran)
 * Licensed under MIT (github.com/zkreations/wjs-related/blob/master/LICENSE)
 * Edited by Byzeroblogger (KuroSensei) (https://github.com/KuroSensei/wjs-related)
 */

 //opciones

var option = {
      id: '1692379497738760100', // Codigo unico del post
      homepage: 'https://www.byzeroblogger.com', // Url blog de prueba (debe corresponder a la ID del post)
      image: 'img/no-img-blogger.png', // Imagen por defecto
      length: 2, // Cantidad de entradas relacionadas a mostrar
      snippet: 100, // Cantidad texto para el resumen
      imgSize: 's256-c', // Tamaño de la imagen (cuadrada)
      html: '', //html de los post
      container: document.getElementById('wjs-related'), // Selector
      tags: ['plantilla','blogger'] // Etiquetas de prueba
};

var related = (function(){

    var initialize = function (option){
 
       var tags$length = option.tags.length;
 
       var tags="";
 
       for (var i = 0; i < tags$length; i++) {
          tags += '"'+ option.tags[ i ] + '"' + ( i === option.tags.length - 1 ? '' : '|' );        
       }
 
       var script = document.createElement( 'script' );
 
       var src = option.homepage + '/feeds/posts/default' +
       '?alt=json-in-script' +
       '&callback=relatedPost' +
       '&max-results=' + ( option.length + 1 ) +
       '&q=' + tags;
 
       script.src = src;
       document.body.appendChild( script );

       /*
       Puedes modificar el html de la variable item como gustes.
       claves:
       {title} => devuelve el título.
       {image} => Devuelve la imagen.
       {url} => Devuelve la url.
       {time} => Devuelve la fecha.
       */
 
       var HTMLParser = function(domHTML){
          var item = '<div class="kjs-related-items"><div class="kjs-related-item"><div class="kjs-related-item__image"><a href="{url}"><img src="{image}" alt="{title}" /></a></div><a href="#"><h2 class="kjs-related-item__title">{title}</h2></a><time class="kjs-related-item__time">{time}</time></div></div>'
          return domHTML || item
       }
 
       function render( data ){
 
       // console.log( data ); // Envia a consola los datos json. Eliminar si no se necesita
 
       var title = data.title.$t;
 
       var content = data.content.$t;
 
       var snippet = content.replace(/<[^>]*>?/g,'').substring( 0, option.snippet ) + '...';
 
       var img = data.media$thumbnail;
 
       var tempHtml = document.createElement('div');
 
       tempHtml.innerHTML = content;
 
       var imgHtml = tempHtml.querySelector('img');
 
       var image = ( img ? img.url : (imgHtml ? imgHtml.src : option.image)).replace( 's72-c', option.imgSize);
 
       var url = (function(){
          for ( var i = 0; i < data.link.length; i++ ){
          var link = data.link[i];
          if ( link.rel === 'alternate' ){
             return link.href;
          }
          }
       })();
 
       var published = new Date( data.published.$t ).toLocaleDateString(
          'es-ES',
          {
             year:'numeric',
             month:'long',
             day: 'numeric'
          }
       );
 
       return HTMLParser(option.html || '')
             .replace(/{title}|{image}|{url}|{time}|{labels}/g, function(html){
             if (html === "{title}") {
                return title
             } else if (html === '{image}') {
                return image
             } else if (html === '{url}') {
                return url
             } else if (html === '{time}') {
                return published
             }
          });;
       }
 
       window.relatedPost =  function( json ){
          var i = 0;
          var post;
          var length = option.length;
 
          //vaciamos el contenedor
          option.container.innerHTML = "";
 
          for ( ; i < length && ( post = json.feed.entry[ i ] ); i++ ){
             if ( option.id !== post.id.$t.split( '.post-' )[ 1 ] ){
                option.container.innerHTML += render( post );
             } else {
                length++;
             }
          }
       }
 
    }
 
    return {
       init: initialize
    }
 
 })();