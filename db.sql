CREATE TABLE Subject (
    sub_id INT PRIMARY KEY,
    subject_name VARCHAR(100),
    std VARCHAR(10),
    div VARCHAR(10)
);

CREATE TABLE Chapter (
    ch_id INT PRIMARY KEY,
    chapter_name VARCHAR(100),
    sub_id INT,
    FOREIGN KEY (sub_id) REFERENCES Subject(sub_id)
);

CREATE TABLE Point (
    point_id INT PRIMARY KEY,
    point_name VARCHAR(100),
    point_text TEXT,
    ch_id INT,
    FOREIGN KEY (ch_id) REFERENCES Chapter(ch_id)
);
