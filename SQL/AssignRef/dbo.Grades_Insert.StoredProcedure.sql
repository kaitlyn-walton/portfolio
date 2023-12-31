
CREATE proc [dbo].[Grades_Insert]
			@FoulId int 
			,@GradeTypeId int
			,@Comment nvarchar(1000)
			,@CreatedBy int
			,@Id int OUTPUT

as
/*
	declare @Id int = 0

	declare @FoulId int = 
		,@GradeTypeId int = 
		,@Comment nvarchar(1000) = ''
		,@CreatedBy int = 

	execute dbo.Grades_Insert 
			@FoulId
			,@GradeTypeId
			,@Comment
			,@CreatedBy
			,@Id OUTPUT


*/
BEGIN

	INSERT INTO [dbo].[Grades]
	   ([FoulId]
	   ,[GradeTypeId]
	   ,[Comment]
	   ,[CreatedBy]
	   ,[ModifiedBy])
	VALUES
	   (@FoulId
	   ,@GradeTypeId
	   ,@Comment
	   ,@CreatedBy
	   ,@CreatedBy)
	
	SET @Id = SCOPE_IDENTITY()

END
