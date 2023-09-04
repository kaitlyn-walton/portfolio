USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_Delete]    Script Date: 4/14/2023 7:47:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 4/10/2023
-- Description: Update StatusId to inactive from dbo.Grades
--			    
--Params:		@ModifiedBy int
--				,@Id int				
-- Code Reviewer: Mason Doherty

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

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
GO
