
CREATE proc [dbo].[GradeTypes_Select]
			@IsReplay nvarchar(10)

as
/*
	Declare @IsReplay nvarchar(10) = all
	Execute dbo.GradeTypes_Select @IsReplay
*/
BEGIN

	If @IsReplay = 'true'
		Select	[Id]
				,[Name]
				,[Code]
				,[IsReplay]
		From [dbo].[GradeTypes]
		Where [IsReplay] = 1
	If @IsReplay = 'false'
		Select	[Id]
				,[Name]
				,[Code]
				,[IsReplay]
		From [dbo].[GradeTypes]
		Where [IsReplay] = 0
	If @IsReplay = 'all'
		Select	[Id]
				,[Name]
				,[Code]
				,[IsReplay]
		From [dbo].[GradeTypes]

END
