
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
	Set [FoulId] = 	b.[FoulId]
			,[GradeTypeId] = b.[GradeTypeId]
			,[Comment] = b.[Comment]
			,[ModifiedBy] = @ModifiedBy
			,[DateModified] = @dateNow
			,[StatusId] = b.[StatusId]
	From @BatchUpdateGrades as b inner join dbo.Grades as g
				on g.[Id] = b.[Id]

END
