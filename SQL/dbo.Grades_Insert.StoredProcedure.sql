USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_Insert]    Script Date: 4/14/2023 7:47:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

---- =============================================
---- Author:		Kaitlyn Walton
---- Create date: 4/10/2023
---- Description:Insert into dbo.Grades
----			    
----Params:		@FoulId int 
----				,@GradeTypeId int
----				,@Comment nvarchar(1000)
----				,@CreatedBy int
----				,@Id int OUTPUT
---- Code Reviewer: Mason Doherty

---- MODIFIED BY: 
---- MODIFIED DATE:
---- Code Reviewer:
---- Note:
----
---- =============================================

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

GO
