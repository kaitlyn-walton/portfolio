
CREATE proc [dbo].[FieldPositions_SelectByCrewNeeded]
			@CrewNumber int
			,@ReplayOfficials nvarchar(10) 
			,@AlternateOfficial nvarchar(10)
as
/*
	DECLARE @CrewNumber int = 8
			,@ReplayOfficials int = 10
			,@AlternateOfficial int = 11
	EXECUTE dbo.FieldPositions_SelectByCrewNeeded 
					@CrewNumber
					,@ReplayOfficials
					,@AlternateOfficial
*/
BEGIN 
	If @CrewNumber <= 8
	SELECT	[Id]
			,[Name]
			,[Code]
	FROM	[dbo].[FieldPositions]
	WHERE	Id = ANY 
			(SELECT	Id
			 FROM	dbo.FieldPositions
			 WHERE	Id <= @CrewNumber)
	IF @ReplayOfficials = 'true'
		SELECT	[Id]
				,[Name]
				,[Code]
		FROM	[dbo].[FieldPositions]
		WHERE	Id in (9,10)
	IF @AlternateOfficial = 'true'
		SELECT	[Id]
				,[Name]
				,[Code]
		FROM	[dbo].[FieldPositions]
		WHERE	Id = 
						(SELECT	Id
						 FROM	dbo.FieldPositions
						 WHERE	Id = 11)

END
