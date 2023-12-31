
CREATE proc [dbo].[Seasons_FoulAnalytics]
				@SeasonId int
				,@ConferenceId int

as
/*
	declare @SeasonId int = 5
			,@ConferenceId int = 1
	execute [dbo].[Seasons_FoulAnalytics] 
					@SeasonId
					,@ConferenceId
*/
BEGIN

	SELECT  
			s.[Id]
			,s.[Name]
			,s.[Year]
			,s.[ConferenceId]
			, TotalFouls = (	
					SELECT  COUNT(f.Id)
					FROM	dbo.Fouls as f join dbo.GameReports as gr
									on f.GameReportId = gr.Id
								join dbo.Games as g 
									on g.Id = gr.GameId
								join dbo.Seasons as s
									on s.Id = g.SeasonId and 
										s.ConferenceId = g.ConferenceId
					WHERE	s.Id = @SeasonId AND s.ConferenceId = @ConferenceId
					GROUP BY	s.[Name]
					)
	FROM dbo.Seasons as s
	WHERE s.[Id] = @SeasonId AND
			s.ConferenceId = @ConferenceId
						
END
