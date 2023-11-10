CREATE proc [dbo].[Grades_Analytics_BySeason]
					@SeasonId int
					,@ConferenceId int
as
/*
	DECLARE @SeasonId int = 6
			,@ConferenceId int = 1
	EXECUTE  dbo.Grades_Analytics_BySeason 
					@SeasonId
					,@ConferenceId
*/
BEGIN

	DECLARE @CC int, @IC int, @MC int

	DECLARE @Total int = (	
				SELECT	COUNT(g.Id) 
				FROM	dbo.Grades as g join dbo.Fouls as f
								on f.Id = g.FoulId
							join dbo.GameReports as gr
								on f.GameReportId = gr.Id
							join dbo.Games as ga 
								on ga.Id = gr.GameId
							join dbo.Seasons as s
								on s.Id = ga.SeasonId And
								 ga.ConferenceId = s.ConferenceId
				WHERE	s.Id = @SeasonId And 
						s.ConferenceId = @ConferenceId
				GROUP BY	s.[Name] 
				)

	EXECUTE Grades_ByTypeId_BySeasonId   	1
						,@SeasonId
						,@ConferenceId
						,@CC OUT

	EXECUTE Grades_ByTypeId_BySeasonId   	2
						,@SeasonId
						,@ConferenceId
						, @IC OUT

	EXECUTE Grades_ByTypeId_BySeasonId   	3
						,@SeasonId
						,@ConferenceId
						, @MC OUT

	SELECT  [Id], 
		[Name],
		[Year],
		[ConferenceId],
		@Total as [Total],
		@CC as [CCNumber],
		@IC as [ICNumber],
		@MC as [MCNumber]
	FROM  	dbo.Seasons
	WHERE  [Id] = @SeasonId AND 
			[ConferenceId] = @ConferenceId

END
