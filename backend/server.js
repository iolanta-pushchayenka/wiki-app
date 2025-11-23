import cors from 'cors';
import fsSync from 'fs';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { transliterate as tr } from 'transliteration';
import multer from 'multer';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const wiki_app = express();
wiki_app.use(express.json());

wiki_app.use(cors());

const server = http.createServer(wiki_app);

const wss = new WebSocketServer({ server });

let clients = [];
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter((c) => c !== ws);
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.log('WebSocket error:', err);
  });
});

function sendNotification(message) {
  clients.forEach((ws) => {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message }));
        console.log('Sent notification:', message);
      }
    } catch (err) {
      console.error('WS SEND ERROR:', err);
    }
  });
}

wiki_app.get('/', (req, res) => {
  res.send('API is runnig! Congratulation!!');
});

//folders
const DATA_DIR = path.resolve('./data');
const UPLOADS_DIR = path.resolve('./uploads');

//create folders
if (!fsSync.existsSync(UPLOADS_DIR)) {
  fsSync.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('Created uploads directory at', UPLOADS_DIR);
}
if (!fsSync.existsSync(DATA_DIR)) {
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}

wiki_app.use('/uploads', express.static(UPLOADS_DIR));

function makeSafeFilename(title) {
  const base = tr(title || '')
    .toLowerCase()
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^\w.-]/g, '')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 50);
  return (base || 'file') + '_' + Date.now();
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '')
      .slice(0, 100);
    const uniqueName = `${base}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];

const fileFilter = (req, file, cb) => {
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только файлы JPG/PNG и PDF'));
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

//GET
wiki_app.get('/articles', async (req, res) => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const fileNames = await fs.readdir(DATA_DIR);
    const jsonFiles = fileNames.filter((f) => f.endsWith('.json'));

    const articles = [];
    for (const file of jsonFiles) {
      const filePath = path.join(DATA_DIR, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(content);
        const id = path.basename(file, '.json');

        articles.push({
          id,
          title: parsed.title,
          createdAt: parsed.createdAt,
        });
      } catch (err) {
        console.error(`Failed to read/parse ${file}:`, err);
      }
    }
    res.json(articles);
  } catch (err) {
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
    res.json({ id, ...parsed });
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
      attachments: [],
    };

    await fs.writeFile(filePath, JSON.stringify(article, null, 2), 'utf8');

    res.status(201).json({
      id: path.basename(filename, '.json'),
      title,
      content,
      createdAt: article.createdAt,
      attachments: article.attachments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

// DELETE article + all attachments
wiki_app.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articlePath = path.join(DATA_DIR, `${id}.json`);

    let rawArticle;
    try {
      rawArticle = await fs.readFile(articlePath, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Article not found' });
      }
      throw err;
    }

    const article = JSON.parse(rawArticle);
    const attachments = article.attachments || [];

    for (const att of attachments) {
      const filePath = path.join(UPLOADS_DIR, att.filename);
      try {
        await fs.unlink(filePath);
        console.log(`Deleted attachment: ${att.filename}`);
      } catch (err) {
        console.warn(`Attachment not found, skipping: ${att.filename}`);
      }
    }

    await fs.unlink(articlePath);

    //sendNotification(`Article "${id}" deleted together with ${attachments.length} attachments`);

    res.status(200).json({
      message: 'Article and all attachments deleted',
      deletedAttachments: attachments.length,
    });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT by id
wiki_app.put('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(DATA_DIR, id + '.json');
    await fs.access(filePath);

    const data = await fs.readFile(filePath, 'utf8');
    const article = JSON.parse(data);

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Missing title or content' });
    }

    const updatedArticle = {
      ...article,
      title,
      content,
      createdAt: article.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(updatedArticle, null, 2));

    sendNotification(`Article "${title}" was updated`);

    res.status(200).json(updatedArticle);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ error: 'Not Found' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Attachment by id
wiki_app.post(
  '/articles/:id/attachments',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Файл слишком большой (макс. 10MB)' });
        }

        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },

  async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Файл не загружен или неверный тип' });
      }

      const articlePath = path.join(DATA_DIR, `${id}.json`);

      let raw;
      try {
        raw = await fs.readFile(articlePath, 'utf8');
      } catch (err) {
        await fs.unlink(file.path).catch(() => {});
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: 'Статья не найдена' });
        }
        throw err;
      }

      const article = JSON.parse(raw);

      const attachment = {
        id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString(),
      };

      article.attachments = article.attachments || [];
      article.attachments.push(attachment);

      await fs.writeFile(articlePath, JSON.stringify(article, null, 2), 'utf8');

      sendNotification(`New attachment "${file.originalname}" added to article "${id}"`);

      return res.status(201).json({ message: 'Файл загружен', attachment });
    } catch (err) {
      console.error('Upload error:', err);

      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      return res.status(500).json({ error: 'Ошибка при загрузке файла' });
    }
  },
);

// DELETE attachment
wiki_app.delete('/articles/:id/attachments/:attachmentId', async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    const articlePath = path.join(DATA_DIR, `${id}.json`);

    let rawArticle;
    try {
      rawArticle = await fs.readFile(articlePath, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Статья не найдена' });
      }
      throw err;
    }

    const article = JSON.parse(rawArticle);
    article.attachments = article.attachments || [];

    const attachmentIndex = article.attachments.findIndex((a) => a.id === attachmentId);
    if (attachmentIndex === -1) {
      return res.status(404).json({ error: 'Вложение не найдено' });
    }

    const attachment = article.attachments[attachmentIndex];
    const filePath = path.join(UPLOADS_DIR, attachment.filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('Файл уже отсутствует, пропускаем');
    }

    article.attachments.splice(attachmentIndex, 1);

    await fs.writeFile(articlePath, JSON.stringify(article, null, 2), 'utf8');

    sendNotification(`Attachment "${attachment.originalName}" deleted from article "${id}"`);

    res.json({ message: 'Вложение удалено', attachmentId });
  } catch (err) {
    console.error('Delete attachment error:', err);
    res.status(500).json({ error: 'Ошибка при удалении вложения' });
  }
});

wiki_app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (макс. 10MB)' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message || 'Bad Request' });
  }
  next();
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
