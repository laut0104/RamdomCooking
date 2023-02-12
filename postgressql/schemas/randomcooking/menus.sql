CREATE TABLE IF NOT EXISTS menus(
    id varchar(255) NOT NULL, 
    userid varchar(255) NOT NULL,
    menuname varchar(255) NOT NULL,
    recipes TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userid)
    REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
    )
