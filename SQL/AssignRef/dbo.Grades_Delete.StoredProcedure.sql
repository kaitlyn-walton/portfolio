
CREATE proc [dbo].[Grades_Delete]
				@ModifiedBy int
				,@Id int 
as
/*
	declare @ModifiedBy int = 
			@Id int = 

	execute dbo.Grades_Delete 
			@ModifiedBy
			,@Id

-----StatusId 2 = 'Inactive' 
*/
BEGIN

	Declare @dateNow dateTime2(7) = getutcdate()

	UPDATE [dbo].[Grades]
	   SET	[ModifiedBy] = @ModifiedBy
			,[DateModified] = @dateNow
			,[StatusId] = 2
	 WHERE Id = @Id

END
