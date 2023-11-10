
CREATE proc [dbo].[Users_FoulAnalytics_BySeason]
			@SeasonId int,		
			@UserId int,
			@ConferenceId int 
								
				
as
/*
	declare @SeasonId int = 5
			,@UserId int = 42
			,@ConferenceId int = 1

	execute [dbo].[Users_FoulAnalytics_BySeason]							
						@SeasonId 
						,@UserId
						,@ConferenceId

*/
BEGIN
	
	DECLARE @UserFouls int = (
				SELECT	
					COUNT(f.Id)
				FROM dbo.Fouls as f join dbo.Users as u
									on u.Id = f.CreatedBy
								join dbo.GameReports as gr
									on f.GameReportId = gr.Id
								join dbo.Games as g 
									on g.Id = gr.GameId
								join dbo.Seasons as s
									on s.Id = g.SeasonId and 
										s.ConferenceId = g.ConferenceId
				WHERE s.Id = @SeasonId AND 
							u.Id = @UserId AND 
							s.ConferenceId = @ConferenceId
				GROUP BY u.Id
				)

	SELECT s.[Id],
			s.[Name],
			s.[Year],
			s.[ConferenceId],
			u.[Id],
			u.[FirstName],
			u.[LastName],
			u.[Mi],
			u.[AvatarUrl],
			@UserFouls as [TotalFouls]
	FROM dbo.Seasons as s, 
			dbo.Users as u
	WHERE s.[Id] = @SeasonId AND 
			u.[Id] = @UserId AND 
			s.ConferenceId = @ConferenceId

END
