import express from 'express';
import Database from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar versões de uma página
router.get('/:pageId/versions', authenticateToken, async (req, res) => {
  try {
    const db = Database.getDb()
    
    db.all(
      `SELECT v.*, u.name as author_name 
       FROM page_versions v 
       LEFT JOIN users u ON v.author_id = u.id 
       WHERE v.page_id = ? 
       ORDER BY v.version_number DESC`,
      [req.params.pageId],
      (err, versions) => {
        if (err) {
          console.error('Erro ao listar versões:', err);
          return res.status(500).json({ error: 'Erro ao listar versões' });
        }
        res.json(versions);
      }
    );
  } catch (error) {
    console.error('Erro ao listar versões:', error);
    res.status(500).json({ error: 'Erro ao listar versões' });
  }
});

// Obter versão específica
router.get('/:pageId/versions/:versionNumber', authenticateToken, (req, res) => {
  const db = Database.getDb()
  
  db.get(
    `SELECT v.*, u.name as author_name 
     FROM page_versions v 
     LEFT JOIN users u ON v.author_id = u.id 
     WHERE v.page_id = ? AND v.version_number = ?`,
    [req.params.pageId, req.params.versionNumber],
    (err, version) => {
      if (err) {
        console.error('Erro ao obter versão:', err);
        return res.status(500).json({ error: 'Erro ao obter versão' });
      }
      
      if (!version) {
        return res.status(404).json({ error: 'Versão não encontrada' });
      }
      
      res.json(version);
    }
  );
});

// Comparar duas versões
router.get('/:pageId/versions/:version1/compare/:version2', authenticateToken, (req, res) => {
  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM page_versions WHERE page_id = ? AND version_number = ?',
    [req.params.pageId, req.params.version1],
    (err1, v1) => {
      if (err1) {
        console.error('Erro ao comparar versões:', err1);
        return res.status(500).json({ error: 'Erro ao comparar versões' });
      }
      
      db.get(
        'SELECT * FROM page_versions WHERE page_id = ? AND version_number = ?',
        [req.params.pageId, req.params.version2],
        (err2, v2) => {
          if (err2) {
            console.error('Erro ao comparar versões:', err2);
            return res.status(500).json({ error: 'Erro ao comparar versões' });
          }
          
          if (!v1 || !v2) {
            return res.status(404).json({ error: 'Uma ou ambas as versões não foram encontradas' });
          }
          
          res.json({ version1: v1, version2: v2 });
        }
      );
    }
  );
});

// Restaurar versão específica
router.post('/:pageId/versions/:versionNumber/restore', authenticateToken, (req, res) => {
  const db = Database.getDb()
  
  db.get(
    'SELECT * FROM page_versions WHERE page_id = ? AND version_number = ?',
    [req.params.pageId, req.params.versionNumber],
    (err, version) => {
      if (err) {
        console.error('Erro ao restaurar versão:', err);
        return res.status(500).json({ error: 'Erro ao restaurar versão' });
      }
      
      if (!version) {
        return res.status(404).json({ error: 'Versão não encontrada' });
      }
      
      // Verificar permissão
      db.get('SELECT * FROM pages WHERE id = ?', [req.params.pageId], (err, page) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao verificar permissões' });
        }
        
        if (req.user.role === 'editor' && page.author_id !== req.user.id) {
          return res.status(403).json({ error: 'Sem permissão' });
        }
        
        // Obter próximo número de versão
        db.get(
          'SELECT MAX(version_number) as max_version FROM page_versions WHERE page_id = ?',
          [req.params.pageId],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Erro ao obter versão' });
            }
            
            const newVersionNumber = (result.max_version || 0) + 1;
            
            db.serialize(() => {
              db.run('BEGIN TRANSACTION');
              
              // Atualizar página atual
              db.run(
                `UPDATE pages SET 
                 title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [version.title, version.content, req.params.pageId],
                (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Erro ao restaurar versão' });
                  }
                  
                  // Criar nova versão
                  db.run(
                    `INSERT INTO page_versions (page_id, version_number, title, content, author_id, change_summary, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                    [
                      req.params.pageId,
                      newVersionNumber,
                      version.title,
                      version.content,
                      req.user.id,
                      `Restaurado da versão ${version.version_number}`
                    ],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Erro ao criar nova versão' });
                      }
                      
                      db.run('COMMIT');
                      res.json({ success: true, newVersion: newVersionNumber });
                    }
                  );
                }
              );
            });
          }
        );
      });
    }
  );
});

export default router;
