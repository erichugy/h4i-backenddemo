import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
app.use(express.json()); // Make sure to use middleware to parse JSON body

// Define a type for the post data
interface Post {
    title: string;
    date: string;
    content: string;
}
interface MyBlog{
    title: string;
    description: string;
    posts: Post[];
}

// Define a type for the database structure
interface Database {
    myblog: MyBlog;
}

app.get('/', (req: Request, res: Response) => {
    // Define type for query parameters
    const query = req.query as { name?: string };
    const name = query.name;

    res.status(200).send(`Hello ${name}`);
});

app.get('/database', (req: Request, res: Response) => {
    const data = readDatabase();
    res.status(200).json(data); // Use res.json() for JSON responses
});

app.post('/add-post', (req: Request, res: Response) => {
    // Define type for request body
    const body = req.body as { title: string; date: string; content: string };
    const { title, date, content } = body;

    const log:string = `Request: ${req.body}<br />${addPost(title, date, content)}`;

    res.status(200).send(log);
});

app.delete('/delete-post', (req: Request, res: Response) => {
    // Define type for request body
    const body = req.body as { title: string };
    const { title } = body;

    deletePost(title);
    res.status(200).send('Post deleted from database');
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

// Function to read the database
function readDatabase(): Database {
    const data = fs.readFileSync('database.json', 'utf8');
    const jsonData: Database = JSON.parse(data);
    return jsonData;
}

// Function to add a post to the database
function addPost(title: string, date: string, content: string): string {
    const data = readDatabase();

    const log: string = `data: ${data}<br /> myblog: ${data.myblog}<br /> posts: ${data.myblog.posts}<br /> title: ${title}\n date: ${date}\n content: ${content}\n`;
    const dataString:string = JSON.stringify({ title, date, content });
    if (dataString) 
      data.myblog.posts.push({ title, date, content });
    fs.writeFileSync('database.json', JSON.stringify(data), 'utf8');
    return log;
}

// Function to delete a post from the database
function deletePost(title: string): void {
    const data = readDatabase();
    const newData = data.myblog.posts.filter(post => post.title !== title);
    data.myblog.posts = newData;
    fs.writeFileSync('database.json', JSON.stringify(data), 'utf8');
}
