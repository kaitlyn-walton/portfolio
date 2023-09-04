USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Seasons_FoulAnalytics]    Script Date: 5/17/2023 3:08:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Author:		Kaitlyn Walton
-- Create date: 4/22/2023
-- Description:	calculates the number of fouls for each season
-- Code Reviewer:

-- MODIFIED BY: Kaitlyn Walton
-- MODIFIED DATE: 5/15/2023
-- Code Reviewer:
-- Note:
-- =============================================


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
GO
