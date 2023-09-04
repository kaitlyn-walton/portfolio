USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_Update]    Script Date: 4/14/2023 7:47:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 4/10/2023
-- Description:Update dbo.Grades
--			    
--Params:		@FoulId int 
--				,@GradeTypeId int
--				,@Comment nvarchar(1000)
--				,@ModifiedBy int
--				,@StatusId int
--				,@Id int
-- Code Reviewer: Mason Doherty

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

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

GO
