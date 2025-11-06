import cors from 'cors'; 
import { create } from 'domain';
import express from 'express';
import fs from 'fs/promises';
import path from 'path'; 
import { transliterate as tr } from 'transliteration';


const wiki_app = express()
wiki_app.use(express.json())  

wiki_app.use(cors()) 
 

wiki_app.get('/', (req, res) => {
    res.send('API is runnig! Congratulation!!')
});

const DATA_DIR = path.resolve('./data') 

function makeSafeFilename(title) {
    const base = tr( title || '')
        .toLowerCase()
        .replace(/[/\\?%*:|"<>]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^\w.-]/g, '')
        .replace(/^[-.]+|[-.]+$/g, '')         
        .slice(0, 50);
        return (base || 'file') + '_' + Date.now();
};

//GET
wiki_app.get('/articles', async(req, res) => {    
    try{
    await fs.mkdir(DATA_DIR, { recursive: true });
    const fileNames = await fs.readdir(DATA_DIR);  
    const jsonFiles = fileNames.filter(f => f.endsWith('.json'));
    
    const articles = [];
for (const file of jsonFiles) {
  const filePath = path.join(DATA_DIR, file);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(content);   
    const id = path.basename(file, '.json');

    articles.push ({
      id,
      title: parsed.title,
      createdAt: parsed.createdAt
    })
     
  } catch (err) {
    console.error(`Failed to read/parse ${file}:`, err);
  }
}
    res.json(articles);
}

    catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read articles' });
    }
    
});

// GET by id
wiki_app.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const raw = await fs.readFile(filePath, 'utf8');  
    const parsed = JSON.parse(raw);
    res.json({ id, ...parsed});

  
  } catch (err) {
    console.error(err);
    if (err.code === 'ENOENT') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(500).json({ error: 'Failed to read article' });
  }
});


//POST /articles
wiki_app.post('/articles', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation of input data
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    await fs.mkdir(DATA_DIR, { recursive: true });

    const safeName = makeSafeFilename(title);
    const filename = `${safeName}.json`;
    const filePath = path.join(DATA_DIR, filename);

    const article = {
    title,
    content,
    createdAt: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(article, null, 2), 'utf8');


    res.status(201).json({ id: path.basename(filename, '.json'), title, content, createdAt: article.createdAt,});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save article' });
  }
});


// DELETE by id 

wiki_app.delete ('/articles/:id', async (req, res) => {

try {

const {id} = req.params;
const filePath  = path.join(DATA_DIR, id + '.json')

await fs.access(filePath)

await fs.unlink(filePath)
res.status(204).send()
} catch (err) {
if (err.code === 'ENOENT' ){
return res.status(404).json({error: 'Article Not Found'});
}
return res.status(500).json({error: 'Internal Server Error'});
}
})


//PUT by id 

wiki_app.put ('/articles/:id', async(req, res) => {
try {
const {id} = req.params;
const filePath = path.join(DATA_DIR, id + '.json')
await fs.access(filePath)

const data = await fs.readFile(filePath, 'utf8')
const article = JSON.parse(data)

const {title, content} = req.body 
if (!title || !content) {
  return res.status(400).json({error: 'Missing title or content'})
}

const updatedArticle = {...article, title, content, createdAt: article.createdAt, updatedAt: new Date().toISOString()};

await fs.writeFile(filePath, JSON.stringify(updatedArticle, null, 2))

res.status(200).json(updatedArticle);


} catch (err) {
if (err.code === 'ENOENT') {
return res.status(404).json({error: 'Not Found'})
}
return res.status(500).json({error: 'Internal Server Error'})
}
})


const PORT = 3000;
wiki_app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});


