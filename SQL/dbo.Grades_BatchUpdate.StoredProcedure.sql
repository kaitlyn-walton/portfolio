USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_BatchUpdate]    Script Date: 4/14/2023 7:47:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 4/11/2023
-- Description:BatchUpdate for dbo.Grades
--			    
--Params:		@BatchUpdateGrades BatchUpdateGrades READONLY
--				,@ModifiedBy int
-- Code Reviewer: Mason Doherty

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Grades_BatchUpdate]
			@BatchUpdateGrades dbo.BatchUpdateGrades READONLY
			,@ModifiedBy int

as
/*
	declare @BatchUpdateGrades dbo.BatchUpdateGrades
				,@ModifiedBy int = 6

	insert into @BatchUpdateGrades (FoulId, GradeTypeId, Comment, StatusId, Id)
	values (), ()

	execute [dbo].[Grades_BatchUpdate] 
								@BatchUpdateGrades
								,@ModifiedBy

*/
BEGIN

	declare @dateNow datetime2(7) = getutcdate()

	Update [dbo].[Grades]
		Set [FoulId] = b.[FoulId]
			,[GradeTypeId] = b.[GradeTypeId]
			,[Comment] = b.[Comment]
			,[ModifiedBy] = @ModifiedBy
			,[DateModified] = @dateNow
			,[StatusId] = b.[StatusId]
	From @BatchUpdateGrades as b inner join dbo.Grades as g
				on g.[Id] = b.[Id]

END


GO
