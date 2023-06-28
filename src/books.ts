import express, { Request, Response } from "express";
import { checkIsAdmin, authenticate, checkBookParams } from "./middleware";

const router = express.Router();

interface Books {
  id: number;
  name: string;
  author: string;
  read: boolean;
}

const books: Books[] = [];

router.get("/", (req: Request, res: Response) => {
  res.send(books);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = books.find((book) => book.id === id);
  if (!data) {
    res.status(404).send("ERROR");
  }
  res.send(data);
});

router.post(
  "/",
  checkIsAdmin,
  checkBookParams,

  (req: Request, res: Response) => {
    const body: Books = req.body;

    books.push(body);
    console.log(books);
    res.status(201).send(books);
  }
);

router.put(
  "/:id",
  checkIsAdmin,
  checkBookParams,
  (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, author, read } = req.body;
    const updateBook = books.find((book) => book.id === id);
    if (updateBook) {
      updateBook.name = name || updateBook.name;
      updateBook.author = author || updateBook.author;
      updateBook.read = read || updateBook.read;
      res.status(201).send(updateBook);
    }
  }
);

router.delete("/:id", checkIsAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const indexOfBook = books.findIndex((book) => book.id === id);
  if (indexOfBook !== -1) {
    books.splice(indexOfBook, 1);
    res.status(204).send();
  }
  res.status(404);
});

export default router;
