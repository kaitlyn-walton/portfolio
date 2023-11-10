
CREATE proc [dbo].[Users_SelectAllSimple]
					@ConferenceId int

as
/*
	DECLARE @ConferenceId int = 1

	EXECUTE dbo.Users_SelectAllSimple @ConferenceId
*/
BEGIN
		
	SELECT	u.[Id]
			,u.[FirstName]
			,u.[LastName]
			,u.[Mi]
			,u.[AvatarUrl]	
	FROM	[dbo].[Users] as u inner join dbo.ConferenceUsers as c
					on u.Id = c.UserId
	WHERE	c.ConferenceId = @ConferenceId

END
