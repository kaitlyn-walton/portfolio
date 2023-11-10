
CREATE proc [dbo].[Grades_Update]
			@FoulId int 
			,@GradeTypeId int
			,@Comment nvarchar(1000)
			,@ModifiedBy int
			,@StatusId int
			,@Id int

as
/*
	declare @Id int = 

	declare @FoulId int = 
			,@GradeTypeId int = 
			,@Comment nvarchar(1000) = ''
			,@ModifiedBy int = 
			,@StatusId int = 

	execute dbo.Grades_Update
				@FoulId
				,@GradeTypeId
				,@Comment
				,@ModifiedBy
				,@StatusId
				,@Id

*/
BEGIN

	Declare @dateNow datetime2(7) = getutcdate()

	UPDATE [dbo].[Grades]
	   SET [FoulId] = @FoulId
		  ,[GradeTypeId] = @GradeTypeId
		  ,[Comment] = @Comment
		  ,[ModifiedBy] = @ModifiedBy
		  ,[DateModified] = @dateNow
		  ,[StatusId] = @StatusId
	 WHERE Id = @Id

END
