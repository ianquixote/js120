// let book1 = {
//   title: "Mythos",
//   author: "Stephen Fry",
//
//   getDescription() {
//     return `${this.title} was written by ${this.author}.`;
//   }
// };
//
// let book2 = {
//   title: "Me Talk Pretty One Day",
//   author: "David Sedaris",
//
//   getDescription() {
//     return `${this.title} was written by ${this.author}.`;
//   }
// };
//
// let book3 = {
//   title: "Aunts aren't Gentlemen",
//   author: "PG Wodehouse",
//
//   getDescription() {
//     return `${this.title} was written by ${this.author}.`;
//   }
// };

function createBook(title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription() {
      if (this.read === true) {
        return `${this.title} was written by ${this.author}. I have read it.`;
      } else {
        return `${this.title} was written by ${this.author}. I haven't read it.`;
      }
    },

    readBook() {
      this.read = true;
    }
  };
}

let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook('Aunts aren\'t Gentlemen', 'PG Wodehouse');

console.log(book1.getDescription());
book1.readBook();
console.log(book1.getDescription());
console.log(book2.getDescription());
console.log(book3.getDescription());
console.log(book1.read);
console.log(book2.read);
book2.readBook();
console.log(book2.read);
console.log(book3.read);
