
CREATE proc [dbo].[Grades_ByTypeId_BySeasonId]
					@GradeTypeId int
					,@SeasonId int
					,@ConferenceId int
					,@Total int OUTPUT
as


BEGIN
			 
	SET @Total = (SELECT COUNT (g.GradeTypeId)
	FROM dbo.Grades as g join dbo.GradeTypes as gt
				on gt.Id = g.GradeTypeId
			join dbo.Fouls as f
				on f.Id = g.FoulId
			join dbo.GameReports as gr
				on f.GameReportId = gr.Id
			join dbo.Games as ga 
				on ga.Id = gr.GameId
			join dbo.Seasons as s
				on s.Id = ga.SeasonId and
				ga.ConferenceId = s.ConferenceId
	WHERE s.Id = @SeasonId AND 
			s.ConferenceId = @ConferenceId
	GROUP BY g.GradeTypeId
	HAVING g.GradeTypeId = @GradeTypeId	)												
					
END
