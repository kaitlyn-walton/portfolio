
CREATE proc [dbo].[Teams_FoulAnalytics]		
				@GameId int

as
/*
	declare @GameId int = 18
	execute dbo.Teams_FoulAnalytics @GameId
*/
BEGIN

	DECLARE @HomeTeamFouls int = (
					SELECT	COUNT (f.Id) 
					FROM	dbo.Fouls as f join dbo.Games as g
								on g.HomeTeamId = f.TeamId
					WHERE	g.HomeTeamId = f.TeamId AND g.Id = @GameId) 

	DECLARE @VisitingTeamFouls int =(
					SELECT	COUNT (f.Id) 
					FROM	dbo.Fouls as f join dbo.Games as g
								on g.VisitingTeamId = f.TeamId
					WHERE	g.VisitingTeamId = f.TeamId AND g.Id = @GameId)

	SELECT	@HomeTeamFouls as HomeTeam,			
		ROUND(100.0 * @HomeTeamFouls/ SUM(@HomeTeamFouls + @VisitingTeamFouls), 1) as HomeTeamPercentage,
		@VisitingTeamFouls as VisitingTeam,
		ROUND(100.0 * @VisitingTeamFouls/ SUM(@HomeTeamFouls + @VisitingTeamFouls), 1) as VisitingTeamPercentage
			
END
