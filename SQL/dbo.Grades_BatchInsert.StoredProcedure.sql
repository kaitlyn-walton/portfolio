USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_BatchInsert]    Script Date: 4/14/2023 7:47:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 4/10/2023
-- Description:BatchInsert into dbo.Grades
--			    
--Params:		@BatchInsertGrades dbo.BatchInsertGrades READONLY
--				,@CreatedBy int
-- Code Reviewer: Mason Doherty

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Grades_BatchInsert]
					@BatchInsertGrades dbo.BatchInsertGrades READONLY
					,@CreatedBy int

as
/*	
	declare @BatchInsertGrades BatchInsertGrades
				,@CreatedBy int = 

	insert into @BatchInsertGrades (FoulId, GradeTypeId, Comment)
	values (), ()

	execute dbo.Grades_BatchInsert 
						@BatchInsertGrades
						,@CreatedBy

*/
BEGIN

	Declare @newIds table ( [Id] int )

	INSERT INTO [dbo].[Grades]
           ([FoulId]
           ,[GradeTypeId]
           ,[Comment]
           ,[CreatedBy]
           ,[ModifiedBy])
	
	Output inserted.[Id] 
	Into @newIds

	Select b.[FoulId]
			,b.[GradeTypeId]
			,b.[Comment]
			,@CreatedBy
			,@CreatedBy
	From @BatchInsertGrades as b

	Select n.[Id]
	from @newIds as n inner join dbo.Grades as g
				on n.[Id] = g.[Id]
	where n.[Id] = g.[Id]

END
GO
