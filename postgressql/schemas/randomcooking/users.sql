CREATE TABLE IF NOT EXISTS users(
    id varchar(255) NOT NULL, 
    lineuserid varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    PRIMARY KEY (id)
    UNIQUE KEY (lineuserid)
);
