// Classe Livros: Representa um livro
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// Classe Ui: Lidar com tarefas do usuário
class UI{
    static displayBooks(){
        
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
        }

        static addBookToList(book){
            const list = document.querySelector('#book-list');
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete"></a></td>
            `;

            list.appendChild(row);
        }

        static showAlert(message, className){
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const container = document.querySelector('.container');
            const form = document.querySelector('#book-form');
            container.insertBefore(div,form);
            //Aviso dura 3 segundos
            setTimeout(() => document.querySelector('.alert').remove(), 3000);
        }
        
        static clearFields(){
            document.querySelector('#title').value = '';
            document.querySelector('#author').value = '';
            document.querySelector('#isbn').value = '';
        }

        static deleteBook(el){
            if(el.classList.contains('delete')){
                el.parentElement.parentElement.remove();
            }
        }
}
// Classe de Arquivamento
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Evento: Mostrar Livro
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Evento: Add Livro
document.querySelector('#book-form').addEventListener('submit', (e) => {
    
    // Pevenir default submit
    e.preventDefault();

    // Pegar os valores
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validação
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Por favor preencha todos os campos!', 'danger');
    }else{
        // Instanciar book
        const book = new Book(title, author, isbn);

        // Adicionar livro na UI
        UI.addBookToList(book);

        //Add livro no arquivo
        Store.addBook(book);

        // Mensagem de Sucesso
        UI.showAlert('Livro adicionado!', 'success');

        //Método limpar campos
        UI.clearFields();
    }   
});

    // Evento: Remover Livro
    document.querySelector('#book-list').addEventListener('click', (e) => {
       //Remove o livro da UI
        UI.deleteBook(e.target)

        //Remove livro do arquivo
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

                // Mensagem de Sucesso
                UI.showAlert('Livro removido!', 'success');
    });