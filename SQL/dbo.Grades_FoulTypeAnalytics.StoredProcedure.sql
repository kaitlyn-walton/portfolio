USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_FoulTypeAnalytics]    Script Date: 5/17/2023 3:08:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- Author:		Kaitlyn Walton
-- Create date: 4/24/2023
-- Description:	calculates the total number of grades 
--				based on the season and FoulTypeId. 
--				receives the total number for gradeTypeId's 1-3 
--				from proc "[dbo].[Grades_ByFoulType_BySeasonId]"
-- Code Reviewer:

-- MODIFIED BY: Kaitlyn Walton
-- MODIFIED DATE: 5/15/2023
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Grades_FoulTypeAnalytics]
					@FoulTypeId int 
					,@SeasonId int 
					,@ConferenceId int

as
/*
	Declare @FoulTypeId int = 2
			,@SeasonId int = 7
			,@ConferenceId int = 3
	execute dbo.Grades_FoulTypeAnalytics 
								@FoulTypeId,
								@SeasonId,
								@ConferenceId

	-- SeasonId 5-10
	-- FoulTypeId 1-64
*/
BEGIN

	DECLARE	@CC int, @IC int, @MC int

	DECLARE @Total int = (
						SELECT 
							COUNT (ft.Id)
						FROM dbo.Grades as g join dbo.Fouls as f
									on f.Id = g.FoulId
								join dbo.FoulTypes as ft
									on ft.Id = f.FoulTypeId
								join dbo.GameReports as gr
									on f.GameReportId = gr.Id
								join dbo.Games as ga 
									on ga.Id = gr.GameId
								join dbo.Seasons as s
									on s.Id = ga.SeasonId and 
										s.ConferenceId = ga.ConferenceId
						WHERE ft.Id = @FoulTypeId and s.Id = @SeasonId and ga.ConferenceId = @ConferenceId
						GROUP BY ft.Id
						)

	EXECUTE Grades_ByFoulType_BySeasonId 
									@FoulTypeId
									,@SeasonId
									,@ConferenceId
									,1
									,@CC OUT

	EXECUTE Grades_ByFoulType_BySeasonId 
									@FoulTypeId
									,@SeasonId
									,@ConferenceId
									,2
									,@IC OUT

	EXECUTE Grades_ByFoulType_BySeasonId 
									@FoulTypeId
									,@SeasonId
									,@ConferenceId
									,3
									,@MC OUT

	DECLARE @FoulName nvarchar(50) = (
										SELECT [Name]
										FROM dbo.FoulTypes
										WHERE Id = @FoulTypeId)

	SELECT	
			[Id], 
			[Name],
			[Year],	
			[ConferenceId],
			@Total as [Total],
			@CC as [CCNumber],
			@IC as [ICNumber],
			@MC as [MCNumber],
			@FoulName as [FoulType]

	FROM  dbo.Seasons
	WHERE  [Id] = @SeasonId AND 
			[ConferenceId] = @ConferenceId

END
GO
