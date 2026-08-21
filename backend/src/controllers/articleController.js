const db = require('../config/database');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

exports.getAllArticles = (req, res) => {
  try {
    const { status, category } = req.query;
    let query = 'SELECT * FROM articles';
    const params = [];
    const conditions = [];

    if (status && status !== 'Tất cả') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (category && category !== 'Tất cả') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const articles = db.prepare(query).all(...params);
    res.json({ success: true, data: articles, count: articles.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArticleById = (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài báo' });
    }
    // Increment view count
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArticleBySlug = (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(req.params.slug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài báo' });
    }
    // Increment view count
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(article.id);
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createArticle = (req, res) => {
  try {
    const { title, publisher, badge, category, author, summary, content, published_date, status, image } = req.body;

    if (!title || !publisher || !summary || !content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tiêu đề, tòa soạn, tóm tắt và nội dung' });
    }

    let slug = slugify(title);
    const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const stmt = db.prepare(`
      INSERT INTO articles (title, slug, publisher, badge, category, author, summary, content, published_date, views, status, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      slug,
      publisher,
      badge || '5.0 ★ EXCELLENT',
      category || 'Ẩm Thực & Di Sản',
      author || publisher,
      summary,
      content,
      published_date || new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
      0,
      status || 'Đã xuất bản',
      image || ''
    );

    const newArticle = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newArticle, message: 'Tạo bài báo truyền thông thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateArticle = (req, res) => {
  try {
    const { id } = req.params;
    const { title, publisher, badge, category, author, summary, content, published_date, status, image } = req.body;

    const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài báo' });
    }

    const stmt = db.prepare(`
      UPDATE articles 
      SET title = ?, publisher = ?, badge = ?, category = ?, author = ?, summary = ?, content = ?, published_date = ?, status = ?, image = ?
      WHERE id = ?
    `);

    stmt.run(
      title !== undefined ? title : existing.title,
      publisher !== undefined ? publisher : existing.publisher,
      badge !== undefined ? badge : existing.badge,
      category !== undefined ? category : existing.category,
      author !== undefined ? author : existing.author,
      summary !== undefined ? summary : existing.summary,
      content !== undefined ? content : existing.content,
      published_date !== undefined ? published_date : existing.published_date,
      status !== undefined ? status : existing.status,
      image !== undefined ? image : existing.image,
      id
    );

    const updated = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật bài báo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteArticle = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài báo' });
    }

    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa bài báo khỏi hệ thống' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
