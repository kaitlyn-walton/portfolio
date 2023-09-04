USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_ByFoulType_BySeasonId]    Script Date: 5/17/2023 3:08:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- Author:		Kaitlyn Walton
-- Create date: 4/26/2023
-- Description:	outputs the number of grades 
--				based on the season, foulTypeId, and gradeTypeId 
--				passed to it from the proc "[dbo].[Grades_FoulTypeAnalytics]"
--				this will specifically be used to calculate gradetypeId's 1-3
-- Code Reviewer:

-- MODIFIED BY: Kaitlyn Walton
-- MODIFIED DATE: 5/15/2023
-- Code Reviewer:
-- Note: Hector had me set these 2 procs up this way for simplicity and less code
-- =============================================

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
GO
