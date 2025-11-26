-- Movie Database Management System Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Watchlist CASCADE;
DROP TABLE IF EXISTS Review CASCADE;
DROP TABLE IF EXISTS Movie_Actors CASCADE;
DROP TABLE IF EXISTS Movie_Directors CASCADE;
DROP TABLE IF EXISTS Movie CASCADE;
DROP TABLE IF EXISTS Actor CASCADE;
DROP TABLE IF EXISTS Director CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- Create Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    DateJoined DATE DEFAULT CURRENT_DATE
);

-- Create Director table
CREATE TABLE Director (
    DirectorID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DOB DATE,
    Nationality VARCHAR(50)
);

-- Create Actor table
CREATE TABLE Actor (
    ActorID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DOB DATE,
    Nationality VARCHAR(50)
);

-- Create Movie table
CREATE TABLE Movie (
    MovieID SERIAL PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    ReleaseYear INTEGER,
    Duration INTEGER, -- in minutes
    Genre VARCHAR(100),
    Language VARCHAR(50),
    Rating DECIMAL(3,1) CHECK (Rating >= 0 AND Rating <= 10)
);

-- Create junction table for Movie-Director relationship (many-to-many)
CREATE TABLE Movie_Directors (
    MovieID INTEGER REFERENCES Movie(MovieID) ON DELETE CASCADE,
    DirectorID INTEGER REFERENCES Director(DirectorID) ON DELETE CASCADE,
    PRIMARY KEY (MovieID, DirectorID)
);

-- Create junction table for Movie-Actor relationship (many-to-many)
CREATE TABLE Movie_Actors (
    MovieID INTEGER REFERENCES Movie(MovieID) ON DELETE CASCADE,
    ActorID INTEGER REFERENCES Actor(ActorID) ON DELETE CASCADE,
    PRIMARY KEY (MovieID, ActorID)
);

-- Create Review table
CREATE TABLE Review (
    ReviewID SERIAL PRIMARY KEY,
    UserID INTEGER REFERENCES Users(UserID) ON DELETE CASCADE,
    MovieID INTEGER REFERENCES Movie(MovieID) ON DELETE CASCADE,
    Rating DECIMAL(3,1) CHECK (Rating >= 0 AND Rating <= 10),
    Comment TEXT,
    Date DATE DEFAULT CURRENT_DATE
);

-- Create Watchlist table
CREATE TABLE Watchlist (
    WatchlistID SERIAL PRIMARY KEY,
    UserID INTEGER REFERENCES Users(UserID) ON DELETE CASCADE,
    MovieID INTEGER REFERENCES Movie(MovieID) ON DELETE CASCADE,
    DateAdded DATE DEFAULT CURRENT_DATE,
    UNIQUE(UserID, MovieID)
);

-- Create indexes for better query performance
CREATE INDEX idx_movie_title ON Movie(Title);
CREATE INDEX idx_movie_genre ON Movie(Genre);
CREATE INDEX idx_review_movie ON Review(MovieID);
CREATE INDEX idx_review_user ON Review(UserID);
CREATE INDEX idx_watchlist_user ON Watchlist(UserID);

-- Insert sample data
INSERT INTO Director (Name, DOB, Nationality) VALUES
('Christopher Nolan', '1970-07-30', 'British-American'),
('Steven Spielberg', '1946-12-18', 'American'),
('Quentin Tarantino', '1963-03-27', 'American');

INSERT INTO Actor (Name, DOB, Nationality) VALUES
('Leonardo DiCaprio', '1974-11-11', 'American'),
('Tom Hanks', '1956-07-09', 'American'),
('Samuel L. Jackson', '1948-12-21', 'American');

INSERT INTO Movie (Title, ReleaseYear, Duration, Genre, Language, Rating) VALUES
('Inception', 2010, 148, 'Sci-Fi', 'English', 8.8),
('The Dark Knight', 2008, 152, 'Action', 'English', 9.0),
('Pulp Fiction', 1994, 154, 'Crime', 'English', 8.9);

INSERT INTO Movie_Directors (MovieID, DirectorID) VALUES
(1, 1),
(2, 1),
(3, 3);

INSERT INTO Movie_Actors (MovieID, ActorID) VALUES
(1, 1),
(2, 1),
(3, 3);

INSERT INTO Users (Name, Email, Password) VALUES
('Admin User', 'admin@movie.com', 'admin123'),
('John Doe', 'john@example.com', 'pass123');
