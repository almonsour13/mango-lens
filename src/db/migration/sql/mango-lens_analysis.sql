
CREATE TABLE IF NOT EXISTS `analysis` (
  `analysisID` int NOT NULL AUTO_INCREMENT,
  `ImageID` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `analyzedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`analysisID`)
);
