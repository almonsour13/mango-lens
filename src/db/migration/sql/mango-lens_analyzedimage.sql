
CREATE TABLE IF NOT EXISTS `analyzedimage` (
  `analyzedImageID` int NOT NULL AUTO_INCREMENT,
  `analysisID` int DEFAULT NULL,
  `imageData` longblob,
  PRIMARY KEY (`analyzedImageID`)
) 
