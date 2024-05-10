const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Connect to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',  
    user: 'root',  
    password: '',  
    database: 'syllabus'  
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    else{
        console.log('Connected to the MySQL database');
    }
    
});

app.get('/', (req, res) => {
    res.send('Express API is running');
})

app.get('/subject', (req, res) => {
    const subjectId = req.params.id;

    const sql = `SELECT subject.sub_id, subject.sub_name, chapter.ch_id, chapter.chapter_name, point.point_id, point.point_name, point.point_text FROM subject JOIN chapter ON subject.sub_id = chapter.sub_id LEFT JOIN point ON chapter.ch_id = point.ch_id ORDER BY chapter.ch_id, point.point_id`;
  
;

    connection.query(sql, [subjectId], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Subject not found');
            return;
        }

        const subjectData = {
            subject_name: results[0].subject_name,
            chapters: []
        };

        const chaptersMap = new Map();

        results.forEach(row => {
            let chapter;

            if (!chaptersMap.has(row.chapter_name)) {
                chapter = {
                    chapter_name: row.chapter_name,
                    points: []
                };
                chaptersMap.set(row.chapter_name, chapter);
            } else {
                chapter = chaptersMap.get(row.chapter_name);
            }

            if (row.point_name) {
                chapter.points.push({
                    point_name: row.point_name,
                    point_text: row.point_text
                });
            }
        });

        subjectData.chapters = Array.from(chaptersMap.values());

        res.json(subjectData);
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
