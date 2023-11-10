
CREATE proc [dbo].[Grades_ByFoulType_BySeasonId]
					@FoulTypeId int
					,@SeasonId int
					,@ConferenceId int
					,@GradeTypeId int					
					,@Total int OUTPUT

as


BEGIN

	SET @Total = (SELECT COUNT (g.GradeTypeId)
	FROM	dbo.Grades as g join dbo.GradeTypes as gt
				on gt.Id = g.GradeTypeId
			join dbo.Fouls as f
				on f.Id = g.FoulId
			join dbo.FoulTypes as ft
				on ft.Id = f.FoulTypeId
			join dbo.GameReports as gr
				on f.GameReportId = gr.Id
			join dbo.Games as ga 
				on ga.Id = gr.GameId
			join dbo.Seasons as s
				on s.Id = ga.SeasonId AND
					s.ConferenceId = ga.ConferenceId
	WHERE	ft.Id = @FoulTypeId and 
			s.Id = @SeasonId and 
			ga.ConferenceId = @ConferenceId
	GROUP BY	g.GradeTypeId
	HAVING	g.GradeTypeId = @GradeTypeId )

END
