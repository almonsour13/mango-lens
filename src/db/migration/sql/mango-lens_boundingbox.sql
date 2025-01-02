-- Table structure for table "analysis"
CREATE TABLE IF NOT EXISTS analysis (
  analysisID SERIAL PRIMARY KEY,
  ImageID INT DEFAULT NULL,
  status SMALLINT DEFAULT 1,
  analyzedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "analyzedimage"
CREATE TABLE IF NOT EXISTS analyzedimage (
  analyzedImageID SERIAL PRIMARY KEY,
  analysisID INT DEFAULT NULL,
  imageData BYTEA,
  FOREIGN KEY (analysisID) REFERENCES analysis(analysisID)
);

-- Table structure for table "boundingbox"
CREATE TABLE IF NOT EXISTS boundingbox (
  boundingBoxID SERIAL PRIMARY KEY,
  diseaseIdentifiedID INT NOT NULL,
  x VARCHAR(45) DEFAULT NULL,
  y VARCHAR(45) DEFAULT NULL,
  w VARCHAR(45) DEFAULT NULL,
  h VARCHAR(45) DEFAULT NULL
);

-- Table structure for table "disease"
CREATE TABLE IF NOT EXISTS disease (
  diseaseID SERIAL PRIMARY KEY,
  diseaseName VARCHAR(255) NOT NULL,
  description TEXT,
  status SMALLINT NOT NULL DEFAULT 1,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "diseaseidentified"
CREATE TABLE IF NOT EXISTS diseaseidentified (
  diseaseIdentifiedID SERIAL PRIMARY KEY,
  analysisID INT NOT NULL,
  diseaseID INT NOT NULL,
  likelihoodScore DOUBLE PRECISION NOT NULL,
  FOREIGN KEY (analysisID) REFERENCES analysis(analysisID),
  FOREIGN KEY (diseaseID) REFERENCES disease(diseaseID)
);

-- Table structure for table "feedback"
CREATE TABLE IF NOT EXISTS feedback (
  feedbackID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  description TEXT,
  status SMALLINT DEFAULT 1,
  feedbackAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "image"
CREATE TABLE IF NOT EXISTS image (
  imageID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  treeID INT NOT NULL,
  imageData BYTEA NOT NULL,
  status SMALLINT DEFAULT 1,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "log"
CREATE TABLE IF NOT EXISTS log (
  logID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  activity TEXT NOT NULL,
  type SMALLINT DEFAULT NULL,
  status SMALLINT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "trash"
CREATE TABLE IF NOT EXISTS trash (
  trashID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  itemID INT DEFAULT NULL,
  type SMALLINT DEFAULT NULL,
  status SMALLINT DEFAULT 1,
  deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "tree"
CREATE TABLE IF NOT EXISTS tree (
  treeID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  treeCode VARCHAR(50) NOT NULL,
  description TEXT,
  status SMALLINT NOT NULL DEFAULT 1,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "user"
CREATE TABLE IF NOT EXISTS "user" (
  userID SERIAL PRIMARY KEY,
  fName VARCHAR(50) NOT NULL,
  lName VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role SMALLINT NOT NULL,
  status SMALLINT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table "userprofileimage"
CREATE TABLE IF NOT EXISTS userprofileimage (
  userProfileImageID SERIAL PRIMARY KEY,
  userID INT DEFAULT NULL,
  imageData BYTEA,
  status SMALLINT DEFAULT 1,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES "user"(userID)
);
