$(document).ready(function(){

    // Recupero l'html del template
    var template_html = $('#todo-template').html();
    // Compilo l'html con la funzione di handlebars
    var template_function = Handlebars.compile(template_html);

    var url_api = 'http://157.230.17.132:3023/todos/';

    stampaCoseDaFare();

    // Cancellazone todo:intercetto il click sull'icona del cestino
    $("#todo-list").on("click", ".cancella", function(){
        // Recupero l'id dell'item da cancellare
        var todo_id = $(this).parent().attr('data-todo_id');
        $(this).parent().fadeOut(500,function(){
            // Chiamata ajax per cancellare l'item
            cancellaCoseDaFare(todo_id);
        });
    });

    // Modifica todo: intercetto il click sull'icona della matita
    $("#todo-list").on("click", ".modifica", function(){

        $('.todo-text').removeClass('hidden');
        $('.edit-todo-input').removeClass('active');
        $('.modifica').removeClass('hidden');
        $('.salva').removeClass('active');
        // Recupero il tag li contenitore
        var todo_li = $(this).parent();

        // nascondo il testo e mostro l'ìinput con il testo già valorizzato
        todo_li.find('.todo-text').addClass('hidden');
        todo_li.find('.edit-todo-input').addClass('active');

        // nascondo la matita e mostro il floppy
        todo_li.find('.modifica').addClass('hidden');
        todo_li.find('.salva').addClass('active');
    });

    // modififca todo: intercetto il  click sul floppy
    $("#todo-list").on("click", ".salva", function(){
        // Recupero il tag li contenitore
        var todo_li = $(this).parent();
        // Recupero il testo aggiornato del todo
        var edit_todo_text = todo_li.find('.edit-todo-input').val().trim();
        if (edit_todo_text.length) {
            // Recupero l'id dell'item da modificare
            var todo_id = todo_li.attr('data-todo_id');
            // Chiamo la funzione che mi modifica la cosa da fare
            modificaCoseDaFare(todo_id, edit_todo_text);
        } else {
            stampaCoseDaFare();
        }
    });

    // Creazione nuovo todo: intercetto l'evento enter
    $("input[type='text']").keypress(function(){
        if(event.which === 13){
            // Leggo il testo inserito dall'utente
            var testo_todo = $(this).val().trim();
            if (testo_todo.length > 0) {
                // Dopo aver premuto enter pulisco l'input
                $(this).val("");
                // Chiamo la funzione he cmi permette di creare una nuova cosa da fare
                creaCoseDaFare(testo_todo);
            } else {
                alert('Inserisci il testo di una nuova cosa da fare');
            }
        }
    });

    $(".fa-plus").click(function(){
        $(".aggiungi").fadeToggle();
    });

    function stampaCoseDaFare(){
        // Chiamata ajax per prendere la lista delle cose da fare
        $.ajax({
            'url': url_api,
            'method': 'GET',
            'success': function(data){
                // Resetto la lista dei todo
                $('#todo-list').empty();
                for (var i = 0; i < data.length; i++) {
                    var variabili = {
                        todo_id: data[i].id,
                        todo_text: data[i].text
                    };
                    var html_todo = template_function(variabili);
                    $("#todo-list").append(html_todo);
                }
            },
            'error': function() {
                alert('Nessun cast trovato');
            }
        });
    }

    function creaCoseDaFare(testo_todo) {
        // Chiamata ajax per salvare una nuova cosa da fare
        $.ajax({
            'url': url_api,
            'method': 'POST',
            'data': {
                'text': testo_todo
            },
            'success': function(data){
                stampaCoseDaFare();
            },
            'error': function() {
                alert('Errore');
            }
        });
    }

    function cancellaCoseDaFare(todo_id) {
        $.ajax({
            'url': url_api + todo_id,
            'method': 'DELETE',
            'success': function(data){
                stampaCoseDaFare();
            },
            'error': function() {
                alert('Errore');
            }
        });
    }

    function modificaCoseDaFare(todo_id, testo_todo) {
        $.ajax({
            'url': url_api + todo_id,
            'method': 'PUT',
            'data': {
                'text': testo_todo
            },
            'success': function(data){
                stampaCoseDaFare();
            },
            'error': function() {
                alert('Errore');
            }
        });
    }
});
