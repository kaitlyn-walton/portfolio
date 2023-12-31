
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

	INSERT INTO [dbo].[Grades] ([FoulId]
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
