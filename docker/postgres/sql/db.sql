CREATE TABLE IF NOT EXISTS users(
    id varchar(255) NOT NULL, 
    lineuserid varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (lineuserid)
);

CREATE TABLE IF NOT EXISTS menus(
    id varchar(255) NOT NULL, 
    userid varchar(255) NOT NULL,
    menuname varchar(255) NOT NULL,
    recipes TEXT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT menus_userid_fkey
    FOREIGN KEY (userid)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
    )
